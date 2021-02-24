import express from 'express'
import filterChannels from '../middleware/channels'

import { readChannelHistory, forward } from '../services/slack'

import { support_channel, general_channel, it_channel, health_channel, finance_channel, userIDList } from '../middleware/channels'

const router = new express.Router()

// import index from ner-server
var ner = require('../../ner-server/index');

// only forward messages posted on the support channel
router.post('/events', filterChannels, async (req, res) => {
    // console.log('event detected')
    // console.log(req.body)

    // which message text to forward, 0 is most recently posted
    let msgIndex = 0

    // user id of whoever posted the message
    let postingUserID = ''

    let confirmationMessage = 'Your message has been sent to '

    // console.log('support channel id:', support_channel)
    // console.log('general channel id', general_channel)
    // console.log('it support channel id:', it_channel)
    // console.log('health channel id:', health_channel)
    // console.log('finance channel id:', finance_channel)

    let status = 200
    await readChannelHistory(support_channel)
        .then(response => {
            let channelHistory = response
            let forwardedMessage = channelHistory.messages[msgIndex].text

            postingUserID = channelHistory.messages[msgIndex].user

            console.log('poster was', postingUserID)

            console.log('starting ner tagging')
            // get tags using ner
            ner.post(
                3000, 9191, forwardedMessage, 
                function(err, res){
                    // console.log("res is:", res)
                    let tags = res.tags
                    console.log('post tags: ' + JSON.stringify(res.tags) +'\n')

                    // choose majority category available as dest channel
                    let destinationChannel = ''
                    let itWordCount = 0
                    let financeWordCount = 0
                    let healthWordCount = 0
                    if (tags.hasOwnProperty('ITSUPPORT'))
                    {
                        let word
                        for (word in tags.ITSUPPORT)
                        {
                            itWordCount++
                        }
                        console.log('it', itWordCount)
                    }
                    if (tags.hasOwnProperty('FINANCE'))
                    {
                        let word
                        for (word in tags.FINANCE)
                        {
                            financeWordCount++
                        }
                        console.log('finance', financeWordCount)
                        destinationChannel = finance_channel
                    }
                    if (tags.hasOwnProperty('HEALTH'))
                    {
                        let word
                        for (word in tags.HEALTH)
                        {
                            healthWordCount++
                        }
                        console.log('health', healthWordCount)
                        destinationChannel = health_channel
                    }
                    if (tags.hasOwnProperty('ITSUPPORT') === false && tags.hasOwnProperty('FINANCE') === false && tags.hasOwnProperty('HEALTH') === false)
                    {
                        console.log("No entities tagged!!!")
                        destinationChannel = general_channel
                    }

                    if (destinationChannel != general_channel)
                    {
                        if (itWordCount >= healthWordCount && itWordCount >= financeWordCount)
                        {
                            destinationChannel = it_channel
                            confirmationMessage = confirmationMessage.concat('itsupport')
                        }
                        else if (financeWordCount >= healthWordCount && financeWordCount >= itWordCount)
                        {
                            destinationChannel = finance_channel
                            confirmationMessage = confirmationMessage.concat('finance')
                        }
                        else if (healthWordCount >= itWordCount && healthWordCount >= financeWordCount)
                        {
                            destinationChannel = health_channel
                            confirmationMessage = confirmationMessage.concat('health')
                        }
                        else
                        {
                            console.log("Word count failed, default to general")
                            destinationChannel = general_channel
                            confirmationMessage = confirmationMessage.concat('general')
                        }
                    }
                    else
                    {
                        console.log("Tagging inconclusive!!!")
                        destinationChannel = general_channel
                        confirmationMessage = confirmationMessage.concat('general')
                    }

                    console.log('finished tagging message')
                    forward(destinationChannel, forwardedMessage)

                    // send confirmation message to user
                    forward(postingUserID, confirmationMessage)
                }
            );
            
        })
        .catch(() => {
            status = 503
        })
    res.status(status).send(req.body.challenge)
})

export default router
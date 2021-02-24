import express from 'express'
import { readChannelHistory, forward } from '../services/slack'

const router = new express.Router()

// the forward command sends the most recent support message to general
// as a test
router.post('/commands', async (req, res) => {

    // which message text to forward, 0 is most recently posted
    let msgIndex = 0

    let status = 200
    let channelHistory = await readChannelHistory(process.env.support_channel)
        /* // equivalent to await forward() below
        .then(response => {
            let channelHistory = response
            let forwardedMessage = channelHistory.messages[msgIndex].text
            forward(process.env.general_channel, forwardedMessage)
        })*/
        .catch(() => {
            status = 503
        })
    // res.status(status).send('Slash command completed.')
    
    let forwardedMessage = channelHistory.messages[msgIndex].text
    console.log('message is:', forwardedMessage)

    status = 200
    await forward(process.env.general_channel, forwardedMessage)
        .catch(() => {
            status = 503
        })
    res.status(status).send('Slash command completed.')
})

export default router
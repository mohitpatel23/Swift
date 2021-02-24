import { listUsers, listChannels } from '../services/slack'

/* only allow messages detected from support channel
or url verification to be forwarded */

let support_channel = ''
let general_channel = ''
let it_channel = ''
let health_channel = ''
let finance_channel = ''
let userIDList= []
export default async (req, res, next) => {
    // console.log(req.body)

    let status = 200

    await listUsers()
        .then(response => {
            for (let i = 0; i < response.ims.length; i++)
            {
                let user_id = response.ims[i].user
                if (!userIDList.includes(user_id))
                {
                    userIDList.push(user_id)
                    console.log('user_id:', user_id)
                }
            }
        })
        .catch(() => {
            console.log('list user error')
            status = 503
        })

    await listChannels()
        .then(response => {
            // console.log("list of channels:")
            // console.log(response.channels)
            // console.log("channel length:", response.channels.length)
            for (let i = 0; i < response.channels.length; i++)
            {
                let channel_id = response.channels[i].id
                let channel_name = response.channels[i].name
                // console.log("channel id:", channel_id)
                // console.log("channel name:", channel_name)
                if (channel_name === 'support')
                {
                    support_channel = channel_id
                }
                else if (channel_name === 'general')
                {
                    general_channel = channel_id
                }
                else if (channel_name === 'itsupport')
                {
                    it_channel = channel_id
                }
                else if (channel_name === 'finance')
                {
                    finance_channel = channel_id
                }
                else if (channel_name === 'health')
                {
                    health_channel = channel_id
                }
            }
            // trying to exit the then function
            // return Promise.resolve(response)
        })
        .catch(() => {
            console.log('list channel error')
            status = 503
        })

    // console.log('support channel id:', support_channel)
    if (req.body.type === "url_verification" || req.body.event.channel === support_channel) {
        // console.log('channel is verified')
        next()
    }
    //next()
}

export { support_channel, general_channel, it_channel, health_channel, finance_channel, userIDList }
import slack from 'slack'

module.exports.readChannelHistory = (channel) => slack.channels.history({token: process.env.slack_app_token, channel})
module.exports.forward = (channel, text) => slack.chat.postMessage({token: process.env.slack_app_token, channel, text})
module.exports.listChannels = () => slack.channels.list({token: process.env.slack_app_token})
module.exports.listUsers = () => slack.im.list({token: process.env.slack_app_token})
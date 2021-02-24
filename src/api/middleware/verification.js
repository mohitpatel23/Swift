export default (req, res, next) => {
    if (req.body.token === process.env.verification_token) {
        next()
    } else {
        console.log('request body\'s token and local env token don\'t match')
        res.sendStatus(403)
    }
}
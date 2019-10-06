const jsonwt = require('jsonwebtoken')
const config = require('../config')

function validate(req, res, next) {
    const token = req.headers['tokenAcceso']

    if (!token) {
        return res.json('ERROR TOKEN')
    }

    const decode = jsonwt.verify(token, config.secret)
    req.userId = decode.id
    next()
}

module.exports = validate

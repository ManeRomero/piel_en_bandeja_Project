const nodemailer = require('nodemailer')
const personalData = require('./personalMail')

let email = {}

email.transporter = nodemailer.createTransport(personalData,
    {
    from: 'pielenbandeja@gmail.com',
    headers: {}
})

module.exports = email
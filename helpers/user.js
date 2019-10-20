const User = require('../models/user')
const mailHelper = require('./nodemailer')
const email = require('../config/nodemailer')
const hbs = require('nodemailer-express-handlebars')
const bcrypt = require('bcryptjs')

let signUpProccess = async (name, email, password, password2) => {
    let validation = validate(name, email, password, password2)
    if (validation === false) {
        return -1
    } else {
        let checking = await checkMail(email)
        if (checking === -1) {
            return checking
        } else if (checking === 'OKAY') {
            return await managePassword(password)
        }
    }
}

let checkMail = async (user_email) => {
    let result = await User.findOne({user_email})
    if (result === null) {
        return 'OKAY'
    } else {
        return -1
    }
}

let managePassword = async (user_pass) => {
    let user = new User
    return await user.codePass(user_pass)
}

let validate = (name, email, pass, pass2) => {
    if (name.lenght < 2 || email.length < 6 || pass.length < 6 ) {
        return false
    } else if (pass !== pass2) {
        return false
    }
    return true
}

/* ENVÍO MAILS */

let sendMail = async (dataEmail) => {
    let userData = await getUserDataByEmail(dataEmail)
    const hash = `${mailHelper.codexName()}-${Date.now()}`
    let save = await saveHash(hash, userData._id)
    const userName = userData.user_name

    if (save) {
        let message = {
            to: dataEmail,
            subject: 'Piel en Bandeja: Valida tu cuenta!',
            template: 'email',
            context: {
                texto: `El mail fue enviado en ${new Date()}.`,
                hash,
                userName
            }
        }

        email.transporter.use('compile', hbs(mailHelper.transporter))
        email.transporter.sendMail(message, (err, info) => {
            console.log('AQUÍ ENTRA')

            if (err) {
                console.log(err, 'CLG ERRORR')
            } else {
                console.log(info, 'AQUÍ EL MENSAJE ', message)
                email.transporter.close()
            }
        })
    } else {
        return -1
    }
}

let getUserDataByEmail = async (user_email) => {
    let result = await User.findOne({ user_email })

    if (result === null) {
        return -1
    } else {
        return result
    }
}

let saveHash = (user_hash, _id) => {
    return User.findByIdAndUpdate(_id, { user_hash })
}

let findHash = async (user_hash) => {
    let result = await User.findOne({user_hash})
    if (result === null) {
        return -1
    }
    return result
}

let activateUser = async (user) => {
    let result = await User.findOneAndUpdate(user.user_hash, {user_active: true})

    console.log (result, 'CONSOLE DE RESULTT')
    if (result === null) {
        return -1
    }
    return result
}

let isAdmin = async (req, res, next) => {
    if (req.session.admin) {
        next()
    } else {
        req.flash('error_msg', 'Debes ser Admin para realizar esta acción')
        res.redirect('/user/logIn')
    }
}

let checkLogin = async (user_email, user_pass) => {
    let isMailActive = await User.findOne({
        user_email,
        user_active: true
    })

    if (isMailActive === null) {
        return isMailActive
    }

    let compare = await comparePass(user_pass, isMailActive)

    if (compare === false) {
        return compare
    }

    return isMailActive
}

let comparePass = async (user_pass, user) => {
    let result = await bcrypt.compare(user_pass, user.user_pass)
    return result
}

module.exports = {
    signUpProccess,
    sendMail,
    findHash,
    activateUser,
    isAdmin,
    checkLogin,
    getUserDataByEmail
}
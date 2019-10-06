const { Router } = require('express')
const router = Router()
const jsonwt = require('jsonwebtoken')
const config = require('../config')
const validate = require('./token')
const User = require('../models/user')

router.get('/', validate, async (req, res, next) => {

    const user = await User.findById(req.userId, { user_pass: null }) // PARA QUE DEVUELVA TODOS LOS DATOS DE USER SIN EL PASS

    if (!user) {
        return res.status(404).send('ERROR EN DATOS')
    }

    const title = 'Piel en Bandeja'

    res.render('index', {
        title
    })
})

router.post('/signup', async (req, res, next) => {
    console.log('AQUÍ ESTÁ ENTRANDO!!', req.body)

    const {
        user_name,
        user_email,
        user_pass,
    } = req.body

    const newUser = new User({
        user_name,
        user_email,
        user_pass,
    })

    newUser.user_pass = await newUser.codePass(newUser.user_pass)

    const token = jsonwt.sign({ id: newUser._id },
        config.secret, {
        expiresIn: 24 * 60 * 60
    })

    newUser.user_hash = token
    await newUser.save()
    console.log('ESTA ES LA CONTRASEÑA CODIFICADA!', newUser.user_pass)

    res.json({status: "USUARIO GUARDADO!!!"})
})

router.post('signin', async (req, res, next) => {
    const { user_email, user_pass } = req.body
    const isUser = await User.findOne({ user_email })

    if (!isUser) {
        return res.status(404).send('PROBLEMAS CON MAIL')
    }

    const checking = await isUser.validaPass(user_pass)
    if (!checking) {
        return res.status(401).json('ERROR EN AUTENTICACIÓN')
    }

    console.log(checking)

    const token = jsonwt.sign({ id: isUser._id }, config.secret, {
        expiresIn: 60 * 60 * 24
    })
    /* res.json(isUser, token) */
    res.redirect('/')
})

module.exports = router
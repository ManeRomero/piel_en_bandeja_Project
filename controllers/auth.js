const { Router } = require('express')
const router = Router()
const jsonwt = require('jsonwebtoken')
const config = require('../config')
const validate = require('./token')
const User = require('../models/user')
const helper = require('../helpers/user')

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

router.get('/signup', async (req, res, next) => {
    res.render('layouts/signup', {
        subtitulo: 'pequeñas grandes cositas de piel'
    })
})

router.post('/signup', async (req, res, next) => {

    let {
        user_name,
        user_email,
        user_pass,
        user_pass_repeat
    } = req.body

    let result = await helper.signUpProccess(user_name, user_email, user_pass, user_pass_repeat)

    if (result === -1) {
        req.flash('error_msg', `ERROR!! Datos mal introducidos. Revisa que la contraseña contenga un mínimo de 6 caracteres,
                                así como Nombre y Dirección e-mail sean válidos`)
        res.redirect('/signup')
    } else {
        user_pass = result

        const newUser = new User({
            user_name,
            user_email,
            user_pass,
        })

        const token = jsonwt.sign({ id: newUser._id },
            config.secret, {
            expiresIn: 24 * 60 * 60
        })

        newUser.user_token = token
        await newUser.save()
        await helper.sendMail(user_email)

        req.flash('success_msg', `Genial, ${user_name}. Verifica el mail que hemos enviado a ${user_email}!`)
        res.redirect('/index')
    }
})

router.get('/activate/:hash', (req, res) => {

    /* let hash = req.params.hash
    let hashFound = await controller.findHash(hash)
    if (hashFound === -1) {
        req.flash('error_msg', 'ERROR!! Hash incorrecto para verificación!')
        res.redirect('/')
    }
    let id = hashFound.dataValues.UserId
    let data = await helper.getUserDatabyId(id)
    let activation = await helper.updateActive(id)

    if (activation === 1) {
        req.flash('success_msg', `Genial ${data.name}! Has verificado tu cuenta. Te damos la bienvenida!`)
        res.redirect('/')
    } else {
        res.redirect('/user/register')
    } */
})


module.exports = router
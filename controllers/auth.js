const { Router } = require('express')
const router = Router()
const jsonwt = require('jsonwebtoken')
const config = require('../config')
const validate = require('./token')
const User = require('../models/user')
const helper = require('../helpers/user')

router.get('/', validate, validationProccess)
router.get('/signup', signupForm)
router.post('/signup', signup)
router.get('/activation/:hash', activation)
router.get('/login', loginForm)
router.post('/login', login)

async function validationProccess(req, res, next) {
    const user = await User.findById(req.userId, { user_pass: null }) // PARA QUE DEVUELVA TODOS LOS DATOS DE USER SIN EL PASS
    if (!user) {
        return res.status(404).send('ERROR EN DATOS')
    }
    const title = 'Piel en Bandeja'
    res.render('index', {
        title
    })
}

async function signupForm(req, res, next) {
    res.render('layouts/signup', {
        subtitulo: 'pequeñas grandes cositas de piel'
    })
}

async function signup(req, res, next) {
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
}

async function activation(req, res) {
    let hash = req.params.hash
    let hashFound = await helper.findHash(hash)
    if (hashFound === -1) {
        req.flash('error_msg', 'ERROR!! Hash incorrecto para verificación!')
        res.redirect('/')
    }

    let activation = await helper.activateUser(hashFound)

    if (activation === undefined || activation === null) {
        req.flash('error_msg', `Lo sentimos ${hashFound.user_name}
        Ha habido un error en la validación del usuario`)
        res.redirect('/index')
    } else {
        req.flash('success_msg', `Genial ${hashFound.user_name}!
        Has verificado tu cuenta. Te damos la bienvenida!`)
        res.redirect('/index')
        let usuario = await User.findById(hashFound._id)
        console.log(usuario, 'CONSOLE LOG DE USUARIO')
    }
}

async function loginForm(req, res) {
    res.render('layouts/login', {
        subtitulo: 'pequeñas grandes cositas de piel'
    })
}

async function login(req, res) {
    let {
        user_email,
        user_pass,
    } = req.body

    let result = await helper.checkLogin(user_email, user_pass)

    if (result === null || result === false) {
        req.flash('error_msg', `Datos de conexión erróneos, o quizá no has activado
        tu cuenta mediante el mail de activación. Revísalo todo!`)
        res.redirect('/login')
    } else {
        startSession(req, res, result)
    }
}

let startSession = (req, res, data) => {
    req.session.name = data.user_name
    req.session.email = data.user_email
    req.session.userId = data.user_id
    /* req.session.admin = data.admin */
    req.session.user = data;

    console.log('SESIÓN COMENZADA[futuroWINSTON]: ', req.session.name)
    req.flash('success_msg', `Hola ${req.session.name}, qué quieres hacer hoy?`)
    res.redirect('/index')
}


module.exports = router
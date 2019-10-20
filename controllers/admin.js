const { Router } = require('express')
const router = Router()
const User = require('../models/user')
const Bandeja = require('../models/bandeja')
const Imagen = require('../models/image')

router.get('/admin', adminView)

async function adminView(req, res) {
    let isAdmin = req.session /* HAY QUE CONTROLAR JSONWEBTOKEN + REQ.SESSION AQUÍ */
    let usersList = await User.find()
    let bandejas = await Bandeja.find()

    if (bandejas !== null) {
        for (let i = 0; i < bandejas.length; i++) {
            let imagenes = await Imagen.find({ bandeja_id: bandejas[i]._id })
            bandejas[i].fotos = imagenes
            console.log(bandejas[i].fotos, 'CLG DE FOTOSSS ')
        }
    }

    if (isAdmin) {
        res.render('layouts/admin', {
            title: 'Panel de control ADMIN',
            subtitle: 'Control sobre datos de Usuario y Bandejas',
            bandejas,
            usersList
        })
    } else {
        req.flash('error_msg', 'Acceso indebido. Fallo en Credenciales')
        res.redirect('/index')
    }
}

module.exports = router
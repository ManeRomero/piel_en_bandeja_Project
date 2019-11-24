const { Router } = require('express')
const router = Router()
const User = require('../models/user')
const Bandeja = require('../models/bandeja')
const Imagen = require('../models/image')

router.get('/admin', adminView)
router.get('/admin/bandejaEdit/:idBandeja', bandejaEditView)
router.put('/admin/bandejaUpdate', bandejaUpdate)
router.delete('/admin/bandejaClear/:idBandeja', bandejaClear)

async function adminView(req, res) {
    let isAdmin = req.session /* HAY QUE CONTROLAR JSONWEBTOKEN + REQ.SESSION AQUÍ */
    let usersList = await User.find()
    let bandejas = await Bandeja.find()

    if (bandejas !== null) {
        for (let i = 0; i < bandejas.length; i++) {
            let imagenes = await Imagen.find({ bandeja_id: bandejas[i]._id })
            bandejas[i].fotos = imagenes
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

async function bandejaEditView(req, res) {
    let _id = req.params.idBandeja
    let bandeja = await Bandeja.findById(_id)
    res.render('layouts/editBandeja', {
        bandeja
    })
}

async function bandejaUpdate(req, res) {
    let {
        band_name,
        band_price,
        band_descr,
        band_medidas
    } = req.body
    
    let update = await Bandeja.findByIdAndUpdate({ _id: req.body._id }, {
        band_name,
        band_price,
        band_descr,
        band_medidas
    })

    if (update === null) {
        req.flash('error_msg', 'Error Actualizando la Bandeja')
        res.redirect('/index')
    }

    req.flash('success_msg', 'Bandeja editada correctamente.')
    res.redirect('/admin')
}

async function bandejaClear(req, res) {
    let _id = req.params.idBandeja
    let borrar = await Bandeja.findByIdAndRemove(_id)

    if (borrar === null) {
        req.flash('error_msg', 'Error Eliminando la bandeja.')
        res.redirect('/admin')
    }

    req.flash('success_msg', 'Bandeja Eliminada Correctamente')
    res.redirect('/admin')
}

module.exports = router
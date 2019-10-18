const { Router } = require('express')
const router = Router()
const Bandeja = require('../models/bandeja')
const helper = require('../helpers/bandeja')
const multerConfig = require('../config/multer')
const imageController = require('./image')
const cloudinary = require('cloudinary')

router.get('/bandeja/:idBandeja', async (req, res) => {
    const id = req.params.idBandeja
    const bandeja = await Bandeja.findById(id)
    const listaBandejas = await Bandeja.find()
    listaBandejas.sort(function() {return Math.random() - 0.5})

    res.render('layouts/detail', {
        title: 'ESTO ES EL DETALLE DE BANDEJA',
        bandeja,
        listaBandejas
    })
})

router.get('/create', (req, res) => {
    res.render('layouts/create', {
        subtitulo: 'Registro de nueva Bandeja'
    })
})

router.post('/create', multerConfig.array('bandejaPics', 100), async (req, res, next) => {
    const {
        band_descr,
        band_price,
        band_foto,
        band_medidas
    } = req.body

    const newBandeja = new Bandeja({
        band_descr,
        band_price,
        band_foto,
        band_medidas
    })

    newBandeja.band_name = helper.randomName();
        let save = await newBandeja.save()
        let uploadedImages = await imageController.managePics(req.files, save._id)

        if (uploadedImages != null) {
            req.flash('success_msg', 'Genial, bandeja creada.')
            res.redirect('/index')
        } else {
            req.flash('error_msg', 'ERROR!! No pudimos registrar tu nueva Bandeja.')
            res.redirect('/create')
        }
})

module.exports = router
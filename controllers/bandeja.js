const { Router } = require('express')
const router = Router()
const Bandeja = require('../models/bandeja')
const Imagen = require('../models/image')

const helper = require('../helpers/bandeja')
const imageController = require('./image')
const multerConfig = require('../config/multer')
const cloudinary = require('cloudinary')

router.get('/bandeja/:idBandeja', async (req, res) => {
    const id = req.params.idBandeja
    const bandeja = await Bandeja.findById(id)
    const imagenes = await Imagen.find({ bandeja_id: id })
    const listaBandejas = await Bandeja.find()

    for (let i = 0; i < listaBandejas.length; i++) {
        let imagenes = await Imagen.find({ bandeja_id: listaBandejas[i]._id })
        listaBandejas[i].imagen = imagenes[0]
    }

    listaBandejas.sort(function () { return Math.random() - 0.5 })
    res.render('layouts/detail', {
        title: 'ESTO ES EL DETALLE DE BANDEJA',
        bandeja,
        listaBandejas,
        imagenes
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

router.get('/add/:id', async (req, res) => {
    if (req.session.carrito === undefined) {
        req.session.carrito = []
    }

    req.session.carrito.push(req.params.id)
    console.log(req.session.carrito, 'ESTO ES EL CARRITO DE LA COMPRA')
    res.send('bandeja añadida')
    req.flash('Genial! Has añadido una bandeja a tu Carrito!')
})

module.exports = router
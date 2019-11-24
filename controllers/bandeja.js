const { Router } = require('express')
const router = Router()
const Bandeja = require('../models/bandeja')
const Imagen = require('../models/image')

const helper = require('../helpers/bandeja')
const imageController = require('./image')
const multerConfig = require('../config/multer')
const cloudinary = require('cloudinary')

router.get('/bandeja/:idBandeja', detailBandeja)
router.get('/create', createView)
router.post('/create', multerConfig.array('bandejaPics', 100), createBandeja)
router.get('/add/:id', addCarrito)
router.get('/carrito', carritoView)
router.get('/masBandejas', randomBandeja)
router.get('/carritoBorrar/:idBandeja', borrarCarrito)

async function detailBandeja (req, res) {
    const id = req.params.idBandeja
    const bandeja = await Bandeja.findById(id)
    const imagenes = await Imagen.find({ bandeja_id: id })
    const listaProvisional = await Bandeja.find()
    let listaBandejas = listaProvisional.filter(item => item._id != id)
    var buttonEnabled = true

    for (let i = 0; i < listaBandejas.length; i++) {
        let imagenes = await Imagen.find({ bandeja_id: listaBandejas[i]._id })
        listaBandejas[i].imagen = imagenes[0]
    }

    if (req.session.carrito !== undefined) {
        if (req.session.carrito.indexOf(id) !== -1) {
            buttonEnabled = false
        }
    }

    listaBandejas.sort(function () { return Math.random() - 0.5 })
    res.render('layouts/detail', {
        title: 'ESTO ES EL DETALLE DE BANDEJA',
        bandeja,
        listaBandejas,
        imagenes,
        buttonEnabled
    })
}

async function createView (req, res) {
    res.render('layouts/create', {
        subtitulo: 'Registro de nueva Bandeja'
    })
}

async function createBandeja (req, res, next) {
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
}

async function addCarrito (req, res) {
    let id = req.params.id
    if (req.session.user === undefined) {
        req.flash('error_msg',
        'Inicia tu sesión para proceder con la compra')
        res.redirect('/bandeja/' + id)
    } else {
        if (req.session.carrito === undefined) {
            req.session.carrito = []
        }
            req.session.carrito.push(id)
            req.flash('succes_msg', 'Genial! Has añadido una bandeja a tu Carrito!')
            res.redirect('/bandeja/' + id)
    }
}

async function carritoView (req, res) {
    let noCarrito = true
    let carritoIds = []
    let listado = []
    let totalPrice = 0

    if (req.session.carrito !== undefined) {
        noCarrito = false
        carritoIds = req.session.carrito
    }

    for (let i = 0; i < carritoIds.length; i++) {
        let bandeja = await Bandeja.findById({_id: carritoIds[i]})
        listado.push(bandeja)
        totalPrice += bandeja.band_price
    }

    for (let i = 0; i < listado.length; i++) {
        let imagenes = await Imagen.find({ bandeja_id: listado[i]._id })
        listado[i].fotos = imagenes[0]
    }

    res.render('layouts/carrito', {
        subtitulo: 'Mis Compras',
        noCarrito,
        listado,
        totalPrice
    })
}

async function randomBandeja (req, res) {
    let bandejas = await Bandeja.find()
    let bandeja = bandejas[Math.floor(Math.random() * bandejas.length)]._id
    res.redirect('/bandeja/' + bandeja)
}

async function borrarCarrito (req, res) {
    let id = req.params.idBandeja
    let carrito = req.session.carrito

    if (typeof carrito === 'object') {
        let newCarrito = carrito.filter(item => item != id)
        req.session.carrito = newCarrito
    }

    req.flash('success_msg', 'Ya no tienes esta Bandeja en tu Carrito')
    res.redirect('/carrito')
}

module.exports = router
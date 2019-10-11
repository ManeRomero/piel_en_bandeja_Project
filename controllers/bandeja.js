const { Router } = require('express')
const router = Router()
const Bandeja = require('../models/bandeja')
const helper = require('../helpers/bandeja')

router.post('/create', async (req, res, next) => {
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
    
    newBandeja.band_name = helper.randomName(Math.random()* 3);
    await newBandeja.save()
    res.json({status: "BANDEJA GUARDADA!!!"})
})

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

module.exports = router
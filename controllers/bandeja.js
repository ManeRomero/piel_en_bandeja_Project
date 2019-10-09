const { Router } = require('express')
const router = Router()
const Bandeja = require('../models/bandeja')

router.post('/create', async (req, res, next) => {
    console.log('AQUÍ ESTÁ ENTRANDO!!', req.body)

    const {
        band_name,
        band_descr,
        band_price,
        band_foto,
        band_medidas
    } = req.body

    const newBandeja = new Bandeja({
        band_name,
        band_descr,
        band_price,
        band_foto,
        band_medidas
    })

    await newBandeja.save()
    console.log('BANDEJA GUARDADA CON NOMBRE: ', newBandeja.band_name)

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
    /* res.send('el id es ' + req.params.idBandeja) */
})


module.exports = router
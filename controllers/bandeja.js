const { Router } = require('express')
const router = Router()
const Bandeja = require('../models/bandeja')

router.post('/create', async (req, res, next) => {
    console.log('AQUÍ ESTÁ ENTRANDO!!', req.body)

    const {
        band_name,
        band_descr,
        band_price,
    } = req.body

    const newBandeja = new Bandeja({
        band_name,
        band_descr,
        band_price,
    })

    await newBandeja.save()
    console.log('BANDEJA GUARDADA CON NOMBRE: ', newBandeja.band_name)

    res.json({status: "BANDEJA GUARDADA!!!"})
})

module.exports = router
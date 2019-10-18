const { Router } = require('express')
const router = Router()
const Bandeja = require('../models/bandeja')
const Imagen = require('../models/image')

router.get('/index', async (req, res) => {
    const listado = await Bandeja.find()
    if (listado !== null) {
        for (let i = 0; i < listado.length; i++) {
            let imagenes = await Imagen.find({bandeja_id: listado[i]._id})
            listado[i].fotos = imagenes
        }

        res.render('layouts/index', {
            listado
        })
    }
})

module.exports = router
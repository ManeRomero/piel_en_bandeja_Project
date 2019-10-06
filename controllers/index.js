const { Router } = require('express')
const router = Router()
const Bandeja = require('../models/bandeja')

router.get('/index', async (req, res) => {
    const listado = await Bandeja.find()
    console.log(listado)
 
    res.render('index', {
        listado
    })
})

module.exports = router
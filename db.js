const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/piel_en_bandeja', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(item => console.log('BASE DE DATOS CONECTADA'))
    .catch(err => console.log('ERROR EN BASE DE DATOS', err))
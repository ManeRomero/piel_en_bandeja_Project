const { Schema, model } = require('mongoose')

const BandejaSchema = new Schema({
    band_name: String,
    band_descr: String,
    band_price: String,
    band_medidas: String
})

module.exports = model('Bandeja', BandejaSchema)
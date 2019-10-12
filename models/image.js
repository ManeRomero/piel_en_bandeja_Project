const { Schema, model } = require('mongoose')

const ImageSchema = new Schema({
    img_url: String,
    bandeja_id: String
})

module.exports = model('Image', ImageSchema)
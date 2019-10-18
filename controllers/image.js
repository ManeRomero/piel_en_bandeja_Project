const Image = require('../models/image')
const cloudinary = require('cloudinary')
const personal = require('../config/personal')
const path = require('path')
const fs = require('fs-extra')

cloudinary.config(personal.cloudinaryConfig)

let managePics = async (files, bandeja_id) => {
    let errors = false
    let numSaves = 0

    if (files.length === 2) {
        for (let i = 0; i < files.length; i++) {
            await cloudinary.v2.uploader.upload(path.join(__dirname, `../public/uploads/${files[i].filename}`), (error, result) => {
                if (error !== undefined) {
                    errors = true
                } else {
                    numSaves += 1
                    let image = new Image({
                        img_url: result.secure_url.substring(result.secure_url.lastIndexOf('upload/') + 7, result.secure_url.length),
                        bandeja_id
                    })
                    let save = image.save()
                }
            })
        }

        if (errors) {
            return null
        } else if (numSaves !== 2) {
            return null
        } else if (numSaves === 2) {
            for (let i = 0; i < files.length; i++) {
                await fs.unlink(files[i].path)
            }
            return 'oh yeah!'
        }
    }
}

module.exports = {
    managePics
}
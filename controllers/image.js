const Image = require('../models/image')

let managePics = async (files, bandeja_id) => {
    let errors = false
    let numSaves = 0    
    
    if (files.length === 2) {
        for (let i = 0; i < files.length; i++) {
            let image = new Image({
                img_url: files[i].filename,
                bandeja_id
            })

            let save = await image.save()

            if (!save) {
                errors = true     
            } else {
                numSaves += 1
            }
        }

        if (errors) {
            return null
        } else if (numSaves !== 2) {
            return null
        } else if (numSaves === 2) {
            return 'oh yeah!'
        }
    }
}

module.exports = {
    managePics
}
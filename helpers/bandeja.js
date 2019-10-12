const names = require('../config/names')

let randomName = () => {
    return names[Math.floor(Math.random() * names.length)]
}

module.exports = {
    randomName
}
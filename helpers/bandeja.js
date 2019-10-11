const words = require('../config/names')

let randomName = (num) => {
    let name = ''
    for (let i = 0; i <= num; i++) {
        name += words[Math.floor(Math.random() * words.length)]
    }
    
    name = name.charAt(0).toUpperCase() + name.slice(1)   
    return name
}

module.exports = {
    randomName
}
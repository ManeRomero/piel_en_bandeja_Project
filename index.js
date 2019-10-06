const app = require('./app')
require('./db')

async function init() {
    await app.listen(3000)
    console.log("SERVIDOR OK")
}

init();
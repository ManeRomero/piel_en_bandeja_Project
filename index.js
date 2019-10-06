const app = require('./app')
require('./database')

async function init() {
    await app.listen(3000)
    console.log("SERVIDOR OK")
}

init();
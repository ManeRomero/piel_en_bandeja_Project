const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const exphbars = require('express-handlebars')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbars({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: {
    format: function (price) {
      return (Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR"
      }).format(price))
    },
    extra: function (discount) {
      return `${discount}% Descuento`
    },
    time: function (time) {
      return moment(time).locale('es').format("dddd, MMMM Do YYYY, h:mm").toUpperCase();
    }
  }
}))
app.set('view engine', '.hbs')

app.use(express.json())
/* app.use(express.urlencoded({ extended: false })) */
app.use(bodyParser.urlencoded({ extended: false }))


app.use(require('./controllers/auth'))
app.use(require('./controllers/bandeja'))

module.exports = app;

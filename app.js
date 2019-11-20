const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const exphbars = require('express-handlebars')
const session = require('express-session')
const cors = require('cors')
const app = express()
const flash = require('connect-flash')
const titles = require('./config/titles')
const override = require('method-override')

app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbars({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: {
    medidas: function (medidas) {
      let datos = medidas.split(' x ')
      let superficie = (((datos[0] * datos[1] * 2) + (((datos[0] * datos[1] * 2) * 20) / 100)) / 10000).toFixed(3)
      let texto = `Medidas: ${datos[0]} cm. ${datos[1]} cm. (${superficie} m²)`
      return texto
    },

    format: function (price) {
      return (Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR"
      }).format(price))
    },

    discount: function (discount) {
      return `${discount}% Descuento`
    },

    time: function (time) {
      return moment(time).locale('es').format("dddd, MMMM Do YYYY, h:mm").toUpperCase();
    }
  }
}))
app.set('view engine', '.hbs')

app.use(cors())
app.use(session({
  name: 'userSession',
  secret: 'myS3cr3tK3y',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 1000,
    Secure: true
  }
}))

app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.session.user;
  res.locals.carrito = req.session.carrito;
  res.locals.since = titles[Math.floor(Math.random() * titles.length)]
  next()
})

app.use(express.json())
/* app.use(express.urlencoded({ extended: false })) */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(override('_method'))

app.use(require('./controllers/auth'))
app.use(require('./controllers/bandeja'))
app.use(require('./controllers/index'))
app.use(require('./controllers/admin'))

module.exports = app;
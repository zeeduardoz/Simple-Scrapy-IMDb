'use strict'

const express = require('express')
const app = express();
const http = require('http').Server(app)

const bodyParser = require('body-parser')
const expressHandlebars = require('express-handlebars');
const handlebars = require('handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('public'));

app.engine('hbs', expressHandlebars({ handlebars, extname: 'hbs', defaultLayout: 'main' }));
app.set('views', './src/view');
app.set('view engine', 'hbs');

module.exports = app;

var routes = require('./routes');
app.use('/', routes);

http.listen(3000, () => console.log('\x1b[32m', `\n[Scraping] ➟  Aplicação scraping API iniciada!`))


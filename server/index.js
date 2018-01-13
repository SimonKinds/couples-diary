const express = require('express')
const favicon = require('serve-favicon')
const path = require('path')
const compression = require('compression')

const app = express()
const api = require('./src/api')

app.use(compression());
app.use('/api', api)

app.use(express.static('../client/build'))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.static('./public/'))

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')))


app.listen(80, 'couplesdiary.simonkindstrom.com', () => {console.log('Listening on port 80')})

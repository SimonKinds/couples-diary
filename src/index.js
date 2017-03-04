const express = require('express')
const vhost = require('vhost')
const path = require('path')

const app = express()
const api = require('./api/index')

app.use('/api', api)

app.use(express.static('build'))

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')))


app.listen(8080, () => {console.log('Listening on port 8080')})

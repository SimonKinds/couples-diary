const express = require('express')
const path = require('path')

const app = express()
const api = require('./src/api')

app.use('/api', api)

app.use(express.static('../client/build'))
app.use(express.static('./public/'))

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')))


app.listen(8080, () => {console.log('Listening on port 8080')})

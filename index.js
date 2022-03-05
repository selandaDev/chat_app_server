const express = require('express')
const path = require('path')
require('dotenv').config()
const port = process.env.PORT

//DB Config
require('./db/config').dbConnection();

// Express
const app = express()

// Lectura y parseo del body
app.use(express.json())

//  Node Server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/sockets')

// Path
const publicPath = path.resolve( __dirname, 'public' )
app.use( express.static( publicPath ))

// Rutas
// app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api/login', require('./routes/auth'))

server.listen(port, (err) => {
    if(err) throw new Error(err);
    console.log('Servidor en funcionamiento')
    console.log(port)
})
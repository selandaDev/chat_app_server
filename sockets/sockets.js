
const { io } = require('../index');


// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado')

    client.on('disconnect', () => {
        console.log('Cliente desconectado')
    })

    // client.on('emitir-mensaje', (payload)=> { // Escucha los mensajes
    //     console.log(payload)
    //     // io.emit('nuevo-mensaje', payload); // Emite a TODOS los clientes
    //     client.broadcast.emit('nuevo-mensaje', payload); // Emite a todos los clientes MENOS a quien lo envio
    // })
})
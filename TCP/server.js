import * as net from 'net'
import { exit } from 'process';
const PORT = 8080;
var sockets = [];


const server = net.createServer();

process.on('SIGINT', () => {
    sockets.forEach(socket => socket.destroy())
    server.close()
    exit(0)
})

server.on('connection', (socket) => {
    socket.nickname = Math.random().toString(36).substr(2, 9);
    sockets.push(socket);

    /* Клиент шлёт информацию */

    socket.on('data', (data) => {
        const message = socket.nickname + ' | ' + data.toString()
        
        if(sockets.length === 0)
            return
        
        sockets.forEach(receiver => receiver.nickname !== socket.nickname && receiver.write(message))
    })

    /* Клиент отсоединяется */

    socket.on('end', () => {
        const goodByeMessage = socket.nickname + ' left the chat'

        sockets.splice(sockets.indexOf(socket), 1);

        if(sockets.length === 0)
            return
        
        sockets.forEach(receiver => receiver.nickname === socket.nickname ? undefined : receiver.write(goodByeMessage))
    })

    /* У клиента возникла ошибка */

    socket.on('error', (err) => {
        console.log(socket.nickname + ' got an error: ' + err.message);
    })
});


server.listen(PORT, () => {
    console.log(`Server is listening on: ${PORT}`)
});
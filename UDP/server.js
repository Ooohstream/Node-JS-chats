import * as udp from 'dgram'
import { exit } from 'process'
const PORT = 41243
var sockets = []

const server = udp.createSocket('udp4')

server.on('listening', () => {
    console.info(`Server has started on ${server.address().port}`)
})

process.on('SIGINT', () => {
    server.close();
    exit(0)
})

const broadcast = (message, sender) => {
    sockets.forEach(socket => socket.nickname !== sender.nickname && server.send(`${sender.nickname}: ${message}`, socket.port, socket.address))
}

server.on('message', (msg, rinfo) => {
    switch (msg.toString()) {
        case 'connected':
            rinfo.nickname = Math.random().toString(36).substr(2, 9);
            console.info(`${rinfo.nickname} connected to the chat!`)
            sockets.push(rinfo);
            break;
        case 'disconnected':
            const socketToClose = sockets.find(item => item.port === rinfo.port)
            console.log(`${socketToClose.nickname} disconnected!`)
            sockets = sockets.filter(socket => socket.port !== socketToClose.port)
            break;
        default:
            broadcast(msg, sockets.find(item => item.port === rinfo.port))
            break;
    }
})

server.bind(PORT)
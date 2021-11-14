import * as net from 'net'
import { exit } from 'process';

const socket = new net.Socket();

socket.on('data', data => {
    console.log(data.toString())
})

process.on('SIGINT', () => {
    socket.destroy();
    exit(0)
})

socket.connect({
    port: 8080,
    host: '192.168.1.67',
}, () => {
    process.stdin.on('data', data => {
        socket.write(data.toString())
    });
})
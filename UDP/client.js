import * as udp from 'dgram'
import { stdin } from 'process'

const client = udp.createSocket('udp4')

client.on('listening', () => {
    console.info(`Client has started on ${client.address().address} ${client.address().port}`)
    client.connect(41243, "192.168.1.67", () => {
        console.log("Connected to the server!")
        client.send('connected')
        stdin.on('data', (data) => {
            client.send(data)
        })
    })
})

client.on('message', (msg) => {
    console.log(msg.toString())
})

process.on('SIGINT', () => {
    client.send('disconnected')
    client.close()
    process.exit(0)
})

client.bind()


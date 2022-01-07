import WebSocket from 'ws'
import dotenv from 'dotenv'
import { v4 } from 'uuid'
import { getRandomInt } from './utils/random'

dotenv.config()
const port = Number(process.env.PORT)

const wss = new WebSocket.WebSocketServer({
    port,
}, () => {
    console.log(`\x1B[32mWebSocketServer Start Successfully!\x1B[0m`)
})

enum WebSocketClientState {
    Pending,
    Chatting,
}

type WebSocketClient = {
    uuid: string;
    ws: WebSocket;
    state: WebSocketClientState;
    to: string;
    // interests: string;
}

class WebSocketClientPool {
    private clients: WebSocketClient[] = [];

    push(ws: WebSocket): WebSocketClient {
        const uuid = v4()
        const webSocketClient = {
            uuid,
            ws,
            state: WebSocketClientState.Pending,
            to: '',
        }
        this.clients.push(webSocketClient)
        return webSocketClient
    }

    get(uuid: string) {
        return this.clients.find(client => client.uuid === uuid)
    }

    remove(webSocketClient: WebSocketClient): number {
        this.clients.splice(this.clients.findIndex(client => client.uuid === webSocketClient.uuid), 1)
        return this.clients.length
    }

    pick(webSocketClient: WebSocketClient) {
        const pickedWebSocketClients = this.clients.filter(client => client.uuid !== webSocketClient.uuid && client.state === WebSocketClientState.Pending)
        if (pickedWebSocketClients.length > 0) {
            const index = getRandomInt(0, pickedWebSocketClients.length - 1)
            const pickedWebSocketClient = pickedWebSocketClients[index]
            pickedWebSocketClient.state = WebSocketClientState.Chatting
            pickedWebSocketClient.to = webSocketClient.uuid
            pickedWebSocketClient.ws.send(JSON.stringify({
                type: 'chat',
                body: {
                    uuid: webSocketClient.uuid,
                }
            }))
            webSocketClient.state = WebSocketClientState.Chatting
            webSocketClient.to = pickedWebSocketClient.uuid
            webSocketClient.ws.send(JSON.stringify({
                type: 'chat',
                body: {
                    uuid: pickedWebSocketClient.uuid,
                }
            }))
            return true
        }
        else {
            return false
        }
    }
}

const webSocketClientPool = new WebSocketClientPool()

wss.on('connection', (ws) => {
    const webSocketClient = webSocketClientPool.push(ws)
    console.log(`\x1B[33mConnect:\x1B[0m ${webSocketClient.uuid}`)
    const message = {
        type: 'connect',
        body: {
            uuid: webSocketClient.uuid,
        },
    }
    ws.send(JSON.stringify(message))
    webSocketClientPool.pick(webSocketClient)
    ws.on('message', (data) => {
        const { type, body } = JSON.parse(data.toString())
        const webSocketClient = webSocketClientPool.get(body.to)
        if (webSocketClient) {
            if (webSocketClient.ws.readyState == WebSocket.OPEN) {
                const message = {
                    type,
                    body,
                }
                webSocketClient.ws.send(JSON.stringify(message))
            }
            else {
                // TODO
            }
        }
    })
    ws.on('close', (e) => {
        console.log(`\x1B[31mDisconnect:\x1B[0m ${webSocketClient.uuid}`)
        const to = webSocketClientPool.get(webSocketClient.to)
        if (to) {
            const message = {
                type: 'disconnect',
            }
            to.ws.send(JSON.stringify(message))
        }
        webSocketClientPool.remove(webSocketClient)
    })
    ws.on('error', (e) => {
        console.log('error', e)
    })
})

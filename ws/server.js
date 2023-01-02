const express = require('express')
const expressWs = require('express-ws')
const bodyParser = require('body-parser')
const { WebSocketServer } = require('ws')
const path = require('path')
const cookieParser = require('cookie-parser')

function main() {
  const app = express()
  expressWs(app)
  const wsServer = new WebSocketServer({ server: app })
  const sockets = new Set()
  const userMap = new Map([
    [1, {
      id: 1,
      username: 'john',
      name: 'John Doe'
    }]
  ])

  app.use(express.static(path.join(__dirname, 'public')))
  app.use(cookieParser())

  // app.get('/', (req, res) => {
  //   res.sendFile(path.join(__dirname, 'index.html'))
  // })

  app.ws('/ws', (ws, res) => {
    sockets.add(ws)
    ws.on('message', (msg) => {
      sockets.forEach((socket) => {
        if (socket !== ws) {
          socket.send(msg)
        }
      })
    })
    ws.on('close', () => {
      sockets.delete(ws)
    })
  })

  app.listen(3000, () => {
    console.log('Example app listenning on port 3000')
  })

  app.post('/login', bodyParser.urlencoded(), (req, res) => {
    const username = req.body.username
    const user = Array.from(userMap.values()).find((user) => user.username === username )
    if (!user) {
      res.status(401).send('Invalid username')
      return
    }
    res.cookie('ssid', user.id)
    res.send('Logged in')
  })
}

main()
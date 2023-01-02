import expressWs, { Application } from 'express-ws'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import path from 'path'

const SECRET_KEY = "^x&+r=lz0k0rex5!beuvri4#7a9!ugm371i_-yt-g=czior_7v"

function main() {
  const app = express() as unknown as Application
  expressWs(app)
  const sockets = new Map()
  const userMap = new Map([
    [1, {
      id: 1,
      username: 'john',
      name: 'John Doe'
    }],
    [2, {
      id: 2,
      username: 'maggio',
      name: 'Mathis'
    }]
  ])

  app.use(express.static(path.join(__dirname, 'public')))
  app.use(cookieParser(SECRET_KEY))

  // app.get('/', (req, res) => {
  //   res.sendFile(path.join(__dirname, 'index.html'))
  // })

  app.get('/login', (req, res) => {
    const ssid = parseInt(req.signedCookies.ssid ??  '', 10)
    if(ssid && userMap.has(ssid)) {
      res.redirect('/')
      return
    }
    
    res.sendFile(path.join(__dirname, 'pages/login/index.html'))
  })

  app.get('/logout', (req, res) => {
    if(!parseInt(req.signedCookies.ssid ?? '', 10)) {
      res.redirect('/login')
      return
    }
    res.clearCookie('ssid')
    res.redirect('/login')
    return
  })
  
  app.get('/', (req, res) => {
    const ssid = parseInt(req.signedCookies.ssid ?? '', 10)
    if(!ssid || !userMap.has(ssid)) {
      res.redirect('/login')
      return
    }

    res.sendFile(path.join(__dirname, 'pages/index.html'))
  })

  app.ws('/ws', (ws, req) => {
    const ssid = parseInt(req.signedCookies.ssid ?? '', 10)
    const user = userMap.get(ssid)
    if (!user) {
      ws.close()
      return
    }
    sockets.set(ssid, ws)
    ws.send(JSON.stringify({
      type: "setName",
      data: user.name
    }))
    ws.on('message', (msg) => {
      sockets.forEach((socket) => {
        if (socket !== ws) {
          socket.send(JSON.stringify({
            type: "message",
            data: {
              name: user.name,
              isMe: false,
              msg
            }
          }))
        } else {
          socket.send(JSON.stringify({
            type: "message",
            data: {
              name: 'Me',
              isMe: true,
              msg
            }
          }))
        }
      })
    })
    ws.on('close', () => {
      sockets.delete(ssid)
    })
  })

  app.listen(3000, () => {
    console.log('Example app listenning on port 3000')
  })

  app.post('/login', bodyParser.urlencoded(), (req, res) => {
    const ssid = parseInt(req.signedCookies.ssid ?? '', 10)
    if(ssid && userMap.has(ssid)) {
      res.redirect('/')
      return
    }
    const username = req.body.username
    const user = Array.from(userMap.values()).find((user) => user.username === username )
    if (!user) {
      res.status(401).send('Invalid username')
      setTimeout(() => res.redirect('/login'), 5000)
      return
    }
    const expiresDate = new Date()
    expiresDate.setDate(expiresDate.getDate() + 14);
    res.cookie('ssid', user.id, { signed: true, httpOnly: true, expires: expiresDate, sameSite: true })
    res.redirect('/')
  })
}

main()
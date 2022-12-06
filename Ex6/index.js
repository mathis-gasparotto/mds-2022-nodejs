const http = require('http')
const fs = require('fs')
const path = require('path')

function readData() {
  return fs.promises.readFile(path.join(__dirname, 'users.json'), 'utf8')
}

async function main() {
  const server = http.createServer(async (req, res) => {
    if(req.url === '/login' && req.method == 'POST') {
      let data = ''
      req.on('data', (chunk) => {
        data += chunk
      })
      req.on('end', async() => {
        const body = JSON.parse(data)
        const userData = JSON.parse(await readData())

        if(body.email === userData.email && body.password === userData.password) {
          res.writeHead(200, {'Content-Type': 'text/plain'})
          res.end('Logged in!')
          return
        }
        res.writeHead(401, {'Content-Type': 'text/plain'})
        res.end('Invalid credentials')
      })
      return
    }

    if(req.url === '/me') {
      if(req.headers['authorization'] === 'Bearer XXX') {
        res.writeHead(200, {'Content-Type': 'application/JSON'})
        res.end(await readData())
        return
      }
  
      res.writeHead(401, {'Content-Type': 'application/JSON'})
      res.end(JSON.stringify({error: 'Unauthorized'}))
      return
    }

    if(req.url === '/users/1' && req.method == 'PATCH') {
      let data = ''
      req.on('data', (chunk) => {
        data += chunk
      })
      req.on('end', async() => {
        const body = JSON.parse(data)
        const userData = JSON.parse(await readData())

        const updatedData = JSON.stringify({...userData, ...body})
        await fs.promises.writeFile(
          path.join(__dirname, 'users.json'),
          updatedData
        )

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(updatedData)
      })
      return
    }
  
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.end('Not Found!')
    return
  })
  server.listen('1234')
}

main()
const http = require('http')
const fs = require('fs')
const path = require('path')

async function main() {
  const server = http.createServer((req, res) => {
    if(req.url === '/helloworld') {
      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.end('Hello World!')
      return
    }

    if(req.url === '/me') {
      if(req.headers['authorization'] === 'Bearer XXX') {
        res.writeHead(200, {'Content-Type': 'application/JSON'})
        res.end(JSON.stringify({name: 'John Doe'}))
        return
      }
  
      res.writeHead(401, {'Content-Type': 'application/JSON'})
      res.end(JSON.stringify({error: 'Unauthorized'}))
      return
    }

    if(req.url === '/index.html' || req.url === '/') {
      fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(data)
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
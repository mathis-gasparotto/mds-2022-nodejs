const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

function readData() {
  return fs.promises.readFile(path.join(__dirname, 'users.json'), 'utf8')
}

async function main() {
  const app = express()

  app.use(bodyParser.json())
  app.use(express.static(path.join(__dirname, 'public')))

  app.post('/login', async (req, res) => {
    const userData = JSON.parse(await readData())

    if(req.body.email === userData.email && req.body.password === userData.password) {
      res.send({login: true})
      return
    }

    res.status(401).send({error: 'Invalid credentials'})
  })

  function ensureAuthenticated(req, res, next) {
    if (req.headers.authorization !== 'Bearer XXX') {
      res.status(401).send({error: 'Invalid credentials'})
      return
    }
    next()
  }

  app.get('/me', ensureAuthenticated, async (req, res) => {
    const userData = JSON.parse(await readData())
    res.send(userData)
  })

  app.patch('/users/:userId', ensureAuthenticated, async (req, res) => {
    const userData = JSON.parse(await readData())

    const updatedData = ({...userData, ...req.body})
    await fs.promises.writeFile(
      path.join(__dirname, 'users.json'),
      JSON.stringify(updatedData, null, 2),
    )

    res.send(updatedData)
  })

  app.listen('1234')
}

main()
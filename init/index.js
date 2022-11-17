const { FILE_PATH } = require('./helper.js')

console.log('test', FILE_PATH)

const FS = require('fs')
const Path = require('path')
const Http = require('http')
const Crypto = require('crypto')

function encryptPassword(password) {
  return Crypto.createHash('sha256').update(password).digest('hex').toString()
}

function comparePassword(password, hash) {
  return encryptPassword(password) === hash
}

FS.readFile("text.txt",  function (error, buffer) {
  if (error) {
    return
  }

  const content = buffer.toString()
  
  console.log('text', content)
})

async function main() {
  const server = Http.createServer()

  server.listen(3000, function() {
    console.log('Server started on port 3000')
  })

  const buffer = await FS.promises.readFile(Path.join(__dirname, "text.txt"))

  const content = buffer.toString()
  console.log('text', content)

  const savedPass = encryptPassword('test')
  console.log("Mon mot de passe 'test' encrypté : ", savedPass)
  console.log(comparePassword('test', savedPass))
}

main()

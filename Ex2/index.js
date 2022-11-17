const crypto = require('crypto')
const fs = require('fs')
const path = require('path')


exports.encryptPassword = function encryptPassword(password) {
  return crypto.createHash('SHA256').update(password).digest('hex').toString()
}

exports.convertPasswordsInFile = async function convertPasswordsInFile(completeInPath, completeOutPath) {
  let buffer
  try {
    buffer = await fs.promises.readFile(completeInPath)
  } catch (e) {
    console.log("In file not found")
    return
  }

  const content = buffer.toString()

  const convertedContent = content
    .split("\n")
    .map((password) => exports.encryptPassword(password)).join("\n")

  await fs.promises.writeFile(completeOutPath, convertedContent)
}

async function main() {
  const [inPath, outPath] = process.argv.slice(2)

  const completeInPath = path.join(process.cwd(), inPath)
  const completeOutPath = path.join(process.cwd(), outPath)

  exports.convertPasswordsInFile(completeInPath, completeOutPath)
  const buffer = await fs.promises.readFile(completeOutPath)
  console.log(buffer.toString())
}

main()
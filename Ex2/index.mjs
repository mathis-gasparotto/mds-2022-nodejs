import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'


export function encryptPassword(password) {
  return crypto.createHash('SHA256').update(password).digest('hex').toString()
}

export async function convertPasswordsInFile(completeInPath, completeOutPath) {
  let buffer;
  try {
    buffer = await fs.promises.readFile(completeInPath);
  } catch (e) {
    console.log("In file not found");
    return;
  }

  const content = buffer.toString();

  const convertedContent = content
    .split("\n")
    .map((password) => encryptPassword(password)).join("\n")

  await fs.promises.writeFile(completeOutPath, convertedContent);
};

async function main() {
  const [inPath, outPath] = process.argv.slice(2)

  const completeInPath = path.join(process.cwd(), inPath)
  const completeOutPath = path.join(process.cwd(), outPath)

  convertPasswordsInFile(completeInPath, completeOutPath)
  const bufferOut = await fs.promises.readFile(completeOutPath)
  console.log(bufferOut.toString())
}

main();
import * as qrcode from 'qrcode'
import * as fs from 'fs'

export async function createQR(username: string, content: string) {
  let createAt = new Date().getTime()
  await qrcode.toFile(`./src/qrcode/${username}_${createAt}.png`, content)
  return `${username}_${createAt}.png`
}

export async function clearQRCodeFolder() {
  fs.readdir('./src/qrcode', (err, files) => {
    for (let file of files) {
      fs.unlink(`./src/qrcode/${file}`, (err) => {
        if (err) {
          throw err
        }
      })
    }
  })
}

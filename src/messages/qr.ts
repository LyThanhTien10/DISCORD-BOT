import { MessageHandle } from '../structures/Message'
import { createQR, clearQRCodeFolder } from '../helpers/qr'
import { AttachmentBuilder } from 'discord.js'

export default new MessageHandle({
  startWith: '!QR',
  run: async ({ message }) => {
    let [startWith, ...other] = message.content.split(' ')

    /* Get text content for creating QRCode */
    while (other[0] == '') {
      other.shift()
    }

    let content = other.join(' ')
    if (!content.length) {
      message.reply('Content can not empty')
    }

    /* Use username and createAt for naming QR image */
    let username = message.author.username
    let imageName = await createQR(username, content)

    /* Reply QR image */
    const attachment = new AttachmentBuilder(`./src/qrcode/${imageName}`, { name: imageName })
    await message.channel.send({ files: [attachment] })

    /* Clear QRCodeFolder */
    clearQRCodeFolder()
  },
})

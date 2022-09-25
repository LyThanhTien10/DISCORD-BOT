import { MessageHandle } from '../structures/Message'

export default new MessageHandle({
  startWith: '!QR',
  regex: /!QR sing/g,
  regexError: 'This is string return if regex error',
  run: async ({ message }) => {
    message.reply('This is your QR Code')
  },
})

import { client } from '..'
import { Event } from '../structures/Event'

export default new Event('messageCreate', async (message) => {
  const startWith = message.content.split(' ')[0]

  const messageHandle = client.messages.get(startWith)

  if (!messageHandle) {
    return
  }

  if (!messageHandle.regex) {
    return messageHandle.run({ client, message })
  }

  if (!messageHandle.regex.test(message.content)) {
    return message.reply(messageHandle.regexError)
  }

  if (message.author != client.user) {
    messageHandle.run({
      client,
      message,
    })
  }
})

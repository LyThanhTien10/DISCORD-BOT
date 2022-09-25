import { Message } from 'discord.js'
import { ExtendedClient } from '../structures/Client'

interface RunOptions {
  client: ExtendedClient
  message: Message
}

type RunFunction = (options: RunOptions) => any

export type MessageType = {
  startWith: string
  regex?: RegExp
  regexError?: string
  run: RunFunction
}

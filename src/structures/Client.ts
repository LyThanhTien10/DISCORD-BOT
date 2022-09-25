import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
  GatewayIntentBits,
} from 'discord.js'
import { Event } from './Event'
import glob from 'glob'
import { promisify } from 'util'
import { CommandType } from '../typings/Command'
import { RegisterCommandsOptions } from '../typings/Client'
import { MessageType } from '../typings/Message'

const globPromise = promisify(glob)

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection()
  messages: Collection<string, MessageType> = new Collection()

  constructor() {
    super({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    })
  }

  start() {
    this.registerModule()
    this.login(process.env.token)
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default
  }

  async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
    if (!guildId) {
      this.application?.commands.set(commands)
    } else {
      this.guilds.cache.get(guildId)?.commands.set(commands)
    }
  }

  async registerModule() {
    const slashCommands: ApplicationCommandDataResolvable[] = []

    const commandFiles = await globPromise(`/commands/*{.ts,.js}`, { root: './src' })
    commandFiles.forEach(async (filePath) => {
      const command: CommandType = await this.importFile(filePath)
      if (!command.name) {
        return
      }

      this.commands.set(command.name, command)
      slashCommands.push(command)
    })

    const messageFiles = await globPromise('/messages/*{.ts,.js}', { root: './src' })
    messageFiles.forEach(async (filePath) => {
      const messageHandle: MessageType = await this.importFile(filePath)
      if (!messageHandle.startWith) {
        return
      }
      this.messages.set(messageHandle.startWith, messageHandle)
    })

    this.on('ready', () => {
      this.registerCommands({
        commands: slashCommands,
        guildId: process.env.guildId,
      })
    })

    const eventFiles = await globPromise(`/events/*{.ts,.js}`, { root: './src' })
    eventFiles.forEach(async (filePath) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath)

      this.on(event.event, event.run)
    })
  }
}

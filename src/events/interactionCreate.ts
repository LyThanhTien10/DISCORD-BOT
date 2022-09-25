import { CommandInteractionOptionResolver } from 'discord.js'
import { client } from '..'
import { Event } from '../structures/Event'

export default new Event('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    await interaction.deferReply()
    const command = client.commands.get(interaction.commandName)
    if (!command) {
      return interaction.followUp('You have use a non exist command')
    }

    command.run({
      client,
      interaction,
      args: interaction.options as CommandInteractionOptionResolver,
    })
  }
})

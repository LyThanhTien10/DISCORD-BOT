import { Command } from '../structures/Command'

export default new Command({
  name: 'ping',
  description: 'replied with pong',
  run: async ({ interaction }) => {
    interaction.followUp('Pong replied')
  },
})
import { Command } from '../structures/Command'

export default new Command({
  name: 'qr',
  description: 'replied with QR code',
  run: async ({ interaction }) => {
    interaction.followUp('This is your QR code')
  },
})

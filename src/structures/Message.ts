import { MessageType } from '../typings/Message'

export class MessageHandle {
  constructor(messageOptions: MessageType) {
    Object.assign(this, messageOptions)
  }
}

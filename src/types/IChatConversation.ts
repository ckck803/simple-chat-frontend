import {IChatMessage} from "~types/IChatMessage.ts";

export interface IChatConversation  {
  messageList: IChatMessage[]
  replyMessage?: IChatMessage
}
import {defineStore} from "pinia";
import {ref} from "vue";
import {IChatMessage} from "~types/IChatMessage.ts";
import axios, {AxiosRequestConfig} from "axios";
import {IChatRoom} from "~types/IChatRoom.ts";
import {IChatConversation} from "~types/IChatConversation.ts";

const PINIA_KEY = 'chat-maessage-store';

const useChatRoomStore = defineStore(PINIA_KEY, () => {
  const initialConversation = {
    messageList: [],
  }

  const chatConversation = ref<IChatConversation>(initialConversation);

  const addMessage = (message: IChatMessage) => {
    console.log("add event")
    console.log("message =======> %o", message)

    chatConversation.value.messageList = [
      message,
      ...chatConversation.value.messageList
    ]
  }

  const getChatRoomMessages = async (chatRoom: IChatRoom) => {
    const requestParam: AxiosRequestConfig = {
      params: {
        size: 20
      }
    }

    await axios.get("/api/chat/message/" + chatRoom.roomId, requestParam).then(res => {
      console.log("%o", res.data);
      chatConversation.value.messageList = res.data.chatMessageList;
    })
  }


  return {
    chatConversation,
    addMessage,
    getChatRoomMessages
  }
})

export default useChatRoomStore;
import {defineStore} from "pinia";
import {ref} from "vue";
import {IChatRoom} from "~types/IChatRoom.ts";

const PINIA_KEY = "page";

const usePageStore = defineStore(PINIA_KEY, () => {
  const chatRoom = ref<IChatRoom>();

  const changeChatRoom = (roomId: IChatRoom) => {
    chatRoom.value = roomId;
  }

  return {
    chatRoom,
    changeChatRoom,
  }
})

export default usePageStore;
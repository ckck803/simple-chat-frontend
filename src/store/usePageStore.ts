import {defineStore} from "pinia";
import {ref} from "vue";
import {IChatRoom} from "~types/IChatRoom.ts";

const PINIA_KEY = "page";

const usePageStore = defineStore(PINIA_KEY, () => {
  const status = ref("loading");
  const chatRoom = ref<IChatRoom>();
  const chatRoomDraft = ref<Map<String, String>>(new Map())

  const changeChatRoom = (roomId: IChatRoom) => {
    chatRoom.value = roomId;
  }

  return {
    chatRoom,
    status,
    changeChatRoom,
    chatRoomDraft,
  }
})

export default usePageStore;
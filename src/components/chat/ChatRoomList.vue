<template>
  <div class="mb-6">
    <h2 class="text-2xl font-bold mb-4">채팅방 개설하기</h2>
    <div class="flex flex-col space-y-4">
      <div>
        <label for="roomName" class="block text-gray-700 font-medium"
        >채팅방 이름</label
        >
        <input
            id="roomName"
            v-model="roomName"
            type="text"
            class="w-full p-3 border border-gray-300 rounded mt-1"
            placeholder="채팅방 이름을 입력하세요"
            required
            @keyup.enter="createChatRoom()"
        />
      </div>
      <button
          type="button"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          @click.prevent="createChatRoom()"
      >
        생성
      </button>
    </div>
  </div>
  <div>
    <h3 class="text-xl font-bold mb-4 ">채팅방 리스트</h3>
    <ul>

      <li v-for="(room, index) in chatRoomList" :key="index"
          @click.prevent="pageStore.changeChatRoom(room)"
          class="group cursor-pointer p-3 rounded mb-2 flex justify-between items-center bg-gray-200 hover:bg-gray-300"
          :class="{ 'bg-blue-500 text-white': selectedChatRoom && selectedChatRoom.roomId === room.roomId, }">
        {{ room.name }}

        <button @click.prevent="deleteChatRoom(room)" class="pointer-events-auto z-10">
          <TrashIcon class="h-[20px] rounded-sm hover:text-[#ff6b6b]"/>
        </button>
      </li>


    </ul>
    <p v-if="chatRoomList.length === 0" class="text-gray-500 text-center">
      No Chat Rooms Available
    </p>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import axios from "axios";
import usePageStore from "~store/usePageStore.ts";
import {IChatRoom} from "~types/IChatRoom.ts";
import {subscribe, subscribeChatRoom} from "~utils/useStomp.ts";
import {IChatMessage} from "~types/IChatMessage.ts";
import useChatRoomStore from "~store/useChatRoomStore.ts";
import {publishChatRoom} from "~utils/useStomp.ts";
import {IChatRoomProtocol} from "~types/IChatRoomProtocol.ts";
import {TrashIcon} from "@heroicons/vue/24/outline";
import Button from "~ui/inputs/Button.vue";

// const messages = reactive<{ [key: string]: IChatMessage[] }>({});
const messages = ref<{ [key: string]: IChatMessage[] }>({});
const chatRoomList = ref<IChatRoom[]>([]);
const roomName = ref("");
const selectedChatRoom = ref();

const pageStore = usePageStore();
const {addMessage} = useChatRoomStore();

axios.defaults.baseURL = "http://127.0.0.1:8080";

async function createChatRoom() {
  const chatRoomProtocol: IChatRoomProtocol = {
    requestType: "CREATE",
    name: roomName.value,
    roomId: "",
  }

  publishChatRoom(chatRoomProtocol)
  alert("채팅방 개설에 성공 했습니다.");
  roomName.value = "";
}

async function deleteChatRoom(room: IChatRoom) {
  const chatRoomProtocol: IChatRoomProtocol = {
    requestType: "DELETE",
    name: room.name,
    roomId: room.roomId,
  }

  publishChatRoom(chatRoomProtocol)
  alert("채팅방 삭제에 성공 했습니다.");
  roomName.value = "";
}

async function getChatRoomList() {
  await axios.get("/api/chat/room").then((res) => {
    chatRoomList.value = res.data.chatRoomList;
  });
}

watch(chatRoomList, () => {
  chatRoomList.value.forEach((chatRoom) => {
    if (!messages.value[chatRoom.roomId]) {
      messages.value[chatRoom.roomId] = [];
    }

    subscribe(chatRoom.roomId, messages, addMessage);
  });
}, {deep: true})

onMounted(async () => {
  await getChatRoomList();
  await subscribeChatRoom(chatRoomList);
});
</script>

<style scoped></style>

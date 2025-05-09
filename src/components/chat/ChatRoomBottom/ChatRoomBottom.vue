<template>
  <div class="w-full">
    <!--selected reply display-->
    <div
        class="relative transition-all duration-200"
        :class="{ 'pt-[60px]': chatConversation?.replyMessage }"
    >
      <ReplyMessage/>
    </div>

    <div
        class="h-auto min-h-[84px] p-5 flex items-end"
        :class="recording ? ['justify-between'] : []"
    >
      <div class="min-h-[44px]">
        <!--select attachments button-->
        <IconButton
            title="open select attachments modal"
            aria-label="open select attachments modal"
            @click="openAttachmentsModal = true"
            v-if="!recording"
            class="group w-7 h-7 md:mr-5 xs:mr-4"
        >
          <PaperClipIcon
              class="w-[20px] h-[20px] text-gray-400 group-hover:text-indigo-300"
          />
        </IconButton>

        <!--recording timer-->
        <Typography
            v-if="recording"
            variant="body-1"
            no-color
            class="text-indigo-300"
        >00:11
        </Typography
        >
      </div>

      <!--message textarea-->
      <div class="grow md:mr-5 xs:mr-4 self-end" v-if="!recording">
        <div class="relative">
          <Textarea
              v-model="newMessage"
              @input="handleSetDraft"
              :value="newMessage"
              class="max-h-[80px] pr-[50px] resize-none scrollbar-hidden"
              auto-resize
              cols="30"
              rows="1"
              placeholder="Write your message here"
              aria-label="Write your message here"
              :onEnter="sendMessage"
          />

          <!--emojis-->
          <div class="absolute bottom-[13px] right-0">
            <!--emoji button-->
            <IconButton
                title="toggle emoji picker"
                aria-label="toggle emoji picker"
                @click="showPicker = !showPicker"
                class="toggle-picker-button group w-7 h-7 md:mr-5 xs:mr-4"
            >
              <XCircleIcon
                  v-if="showPicker"
                  class="w-[20px] h-[20px] text-gray-400 group-hover:text-indigo-300"
              />
              <FaceSmileIcon
                  v-else
                  class="w-[20px] h-[20px] text-gray-400 group-hover:text-indigo-300"
              />
            </IconButton>

            <!--emoji picker-->
            <ScaleTransition>
              <div
                  v-click-outside="handleClickOutside"
                  v-show="showPicker"
                  class="absolute z-10 bottom-[55px] md:right-0 xs:right-[-80px] mt-2"
              >
                <div role="none">
                  <EmojiPicker :show="showPicker"/>
                </div>
              </div>
            </ScaleTransition>
          </div>
        </div>
      </div>

      <div class="min-h-[44px]">
        <!--cancel recording button-->
        <div v-if="recording" @click="handleCancelRecording">
          <Button variant="ghost" color="danger"> Cancel</Button>
        </div>
      </div>

      <div class="min-h-[44px] flex">
        <!--finish recording button-->
        <IconButton
            title="finish recording"
            aria-label="finish recording"
            v-if="recording"
            @click="handleToggleRecording"
            class="relative group w-7 h-7 flex justify-center items-center outline-none rounded-full bg-indigo-300 hover:bg-green-300 dark:hover:bg-green-400 dark:focus:bg-green-400 focus:outline-none transition-all duration-200"
        >
          <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 group-hover:bg-green-300 opacity-40"> </span>
          <MicrophoneIcon class="w-[20px] h-[20px] text-white group-hover:hidden"/>
          <CheckIcon class="w-[20px] h-[20px] hidden text-white group-hover:block"/>
        </IconButton>

        <!--start recording button-->
        <IconButton
            v-else
            @click="handleToggleRecording"
            title="start recording"
            aria-label="start recording"
            class="group w-7 h-7 md:mr-5 xs:mr-4"
        >
          <MicrophoneIcon class="w-[20px] h-[20px] text-gray-400 group-hover:text-indigo-300"/>
        </IconButton>

        <!--send message button-->
        <IconButton
            v-if="!recording"
            class="group w-7 h-7 bg-indigo-300 hover:bg-indigo-400 focus:bg-indigo-400 dark:focus:bg-indigo-300 dark:bg-indigo-400 dark:hover:bg-indigo-400 active:scale-110"
            variant="ghost"
            title="send message"
            aria-label="send message"
            v-on:click="sendMessage"
        >
          <PaperAirplaneIcon class="w-[17px] h-[17px] text-white"/>
        </IconButton>
      </div>
    </div>

    <AttachmentsModal
        :open="openAttachmentsModal"
        :close-modal="() => (openAttachmentsModal = false)"
    />
  </div>
</template>
<script setup lang="ts">
import {Ref, watch} from "vue";

import {ref, onMounted} from "vue";

import {
  CheckIcon,
  FaceSmileIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";
import ReplyMessage from "~components/chat/ChatRoomBottom/ReplyMessage.vue";
import Typography from "~ui/data-display/Typography.vue";
import IconButton from "~ui/inputs/IconButton.vue";
import ScaleTransition from "~ui/transitions/ScaleTransition.vue";
import EmojiPicker from "~ui/inputs/EmojiPicker/EmojiPicker.vue";
import Textarea from "~ui/inputs/Textarea.vue";
import {publish} from "~utils/useStomp.ts";
import AttachmentsModal from "~components/modals/AttachmentsModal/AttachmentsModal.vue";
import useUserInfoStore from "~store/useUserInfoStore.ts";
import Button from "~ui/inputs/Button.vue";
import {storeToRefs} from "pinia";
import useChatRoomStore from "~store/useChatRoomStore.ts";
import {IChatMessage} from "~types/IChatMessage.ts";
import usePageStore from "~store/usePageStore.ts";


const userInfoStore = useUserInfoStore();
const {userInfo} = storeToRefs(userInfoStore);

const pageStore = usePageStore();
const {chatRoomDraft} = usePageStore();
const {chatRoom} = storeToRefs(pageStore);

function sendMessage() {
  if (newMessage.value.trim().length == 0) {
    return;
  }

  if(userInfo.value.userId === ""){
    alert("로그인이 필요합니다.")
  }

  if (!chatRoom.value) {
    return;
  }

  let cntDate = getCurrentDate();
  let cntTime = getCurrentTime();

  const message:IChatMessage = {
    userId: userInfo.value.userId,
    roomId: chatRoom.value.roomId,
    message: newMessage.value,
    sender: userInfo.value.username,
    sendDate: cntDate,
    sendTime: cntTime
  };
  publish(message);
  newMessage.value = "";
}

const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};


const getCurrentTime = () => {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};


// const store = useStore();
// const activeConversation = <IConversation>inject("activeConversation");

const chatMessageStore = useChatRoomStore();
const {chatConversation} = storeToRefs(chatMessageStore)

// the content of the message.
const newMessage:Ref<string> = ref("");
// const value: Ref<string> = ref("");

// determines whether the app is recording or not.
const recording = ref(false);

// open emoji picker.
const showPicker = ref(false);

// open modal used to send multiple attachments attachments.
const openAttachmentsModal = ref(false);

// start and stop recording.
const handleToggleRecording = () => {
  recording.value = !recording.value;
};

// stop recording without sending.
const handleCancelRecording = () => {
  recording.value = false;
};

// close picker when you click outside.
const handleClickOutside = (event: Event) => {
  let target = event.target as HTMLElement;
  let parent = target.parentElement as HTMLElement;

  if (
      target &&
      !target.classList.contains("toggle-picker-button") &&
      parent &&
      !parent.classList.contains("toggle-picker-button")
  ) {
    showPicker.value = false;
  }
};

// (event) set the draft message equals the content of the text area
const handleSetDraft = () => {
  if(!chatRoom.value){
    return;
  }

  const key = chatRoom.value.roomId;
  chatRoomDraft.set(key, newMessage.value);
};

watch(chatRoom, (before, after) => {
  if(before !== after){
    if(!chatRoom.value){
      newMessage.value = "";
      return;
    }
    // console.log("chatRoomDraft ====> %o", chatRoomDraft.get(chatRoom.value.roomId) as string || "")
    newMessage.value = chatRoomDraft.get(chatRoom.value.roomId) as string || "";
  }
})

onMounted(() => {
  // newMessage.value = activeConversation.draftMessage;
  if(!chatRoom.value){
    newMessage.value = "";
    return;
  }
  newMessage.value = chatRoomDraft.get(chatRoom.value.roomId) as string || "";
});
</script>

<style>
input[placeholder="Search emoji"] {
  background: rgba(0, 0, 0, 0);
}

.v3-emoji-picker .v3-header {
  border-bottom: 0;
}

.v3-emoji-picker .v3-footer {
  border-top: 0;
}
</style>

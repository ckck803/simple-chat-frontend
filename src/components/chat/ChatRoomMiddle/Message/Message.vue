<template>
  <div class="select-none">
    <div class="xs:mb-6 md:mb-5 flex" :class="{ 'justify-end': props.self }">
      <!--avatar-->
      <div class="mr-4" :class="{ 'ml-[36px]': props.followUp && !divider }">
        <div
            v-if="!hideAvatar()"
            :aria-label="props.message.sender"
            class="outline-none"
        >
          <div>
            <img :src="defaultImage" class="w-[36px] h-[36px] bg-cover bg-center rounded-full fill-blue-500"/>
          </div>
        </div>
      </div>

      <div class="flex items-end">
        <!--bubble-->
        <div
            @click="handleCloseContextMenu"
            v-click-outside="contextConfig"
            @contextmenu.prevent="handleShowContextMenu"
            class="group max-w-[500px] p-5 rounded-b transition duration-500"
            :class="{
            'rounded-tl ml-4 order-2 bg-indigo-50 dark:bg-gray-600':
              props.self && !props.selected,

            'rounded-tr mr-4 bg-gray-50 dark:bg-gray-600':
              !props.self && !props.selected,

            'rounded-tl ml-4 order-2 bg-indigo-200 dark:bg-indigo-500':
              props.self && props.selected,

            'rounded-tr mr-4 bg-indigo-200 dark:bg-indigo-500':
              !props.self && props.selected,
          }"
        >

          <Typography
              variant="body-2"
              noColor
              v-if="props.message.message"
              class="outline-none text-black opacity-60 dark:text-white dark:opacity-70"
              v-html="linkifyStr((props.message.message as string), {
                            className: props.self ? 'text-black opacity-50' : 'text-indigo-500 dark:text-indigo-300',
                            format: { url: (value) => value.length > 50 ? value.slice(0, 50) + `…` : value }
                        })"
              tabindex="0"
          >
          </Typography>
          <Attachments
              v-if="(props.message.fileList! as [])?.length > 0"
              :fileList="props.message.fileList!"
              :self="props.self"
          />
        </div>

        <!--date-->
        <div>
          <div :class="props.self ? ['ml-4', 'order-1', 'flex', 'justify-end' ] : ['mr-4', 'flex', 'justify-start'] ">
            <Typography variant="body-1" class="whitespace-pre">
              {{ props.message.sender }}
            </Typography>
          </div>

          <div class="flex">
            <div :class="props.self ? ['ml-4', 'order-1'] : ['mr-4']">
              <Typography variant="body-1" class="whitespace-pre">
                {{ props.message.sendTime }}
              </Typography>
            </div>

            <!--read receipt-->
            <Receipt v-if="props.self" :state="tempState"/>
          </div>
        </div>
      </div>
    </div>
    <!--    <MessageContextMenu-->
    <MessageContextMenu
        :selected="props.selected"
        :message="props.message"
        :show="showContextMenu"
        :left="contextMenuCoordinations.x"
        :top="contextMenuCoordinations.y"
        :handle-close-context-menu="handleCloseContextMenu"
        :handle-select-message="handleSelectMessage"
        :handle-deselect-message="handleDeselectMessage"
    />
  </div>
</template>

<script setup lang="ts">

import { Ref} from "vue";
import linkifyStr from "linkify-string";
import {inject, ref} from "vue";
import {IConversation} from "~types/types.ts";
import Typography from "~ui/data-display/Typography.vue";
import Receipt from "~components/chat/ChatRoomMiddle/Message/Receipt.vue";
import {getMessageById} from "~utils/utils.ts";
import {IChatMessage} from "~types/IChatMessage.ts";
import defaultImage from '~assets/image/default_image.jpg'
import Attachments from "~components/chat/ChatRoomMiddle/Message/Attachments.vue";
import MessageContextMenu from "~components/chat/ChatRoomMiddle/Message/MessageContextMenu.vue";
import useChatRoomStore from "~store/useChatRoomStore.ts";
import {storeToRefs} from "pinia";

const tempState = ref("read");

const props = defineProps<{
  message: IChatMessage;
  followUp: boolean;
  self: boolean;
  divider?: boolean;
  selected?: boolean;
}>();


const activeConversation = <IConversation>inject("activeConversation");
const showContextMenu = ref(false);
const contextMenuCoordinations: Ref<{ x: number; y: number }> = ref({
  x: 0,
  y: 0,
});

// open context menu.
const handleShowContextMenu = (event: any) => {
  showContextMenu.value = true;
  contextMenuCoordinations.value = {
    x:
        window.innerWidth - 220 <= event.pageX
            ? window.innerWidth - 250
            : event.pageX,
    y:
        window.innerHeight - 300 <= event.pageY
            ? window.innerHeight - 250
            : event.pageY,
  };
};

// closes the context menu
const handleCloseContextMenu = () => {
  showContextMenu.value = false;
};

// close context menu when opening a new one.
const contextConfig = {
  handler: handleCloseContextMenu,
  events: ["contextmenu"],
};

// decide whether to show or hide avatar next to the image.
const hideAvatar = () => {
  if (props.divider && !props.self) {
    return false;
  } else {
    if (props.followUp) {
      return true;
    }
    if (props.self) {
      return true;
    }
  }
};


const selectedMessages: Ref<number[]> = ref([]);
// determines whether select mode is enabled.
const selectMode = ref(false);
// determines whether all the messages are selected or not.
const selectAll = ref(false);


const chatMessageStore = useChatRoomStore();
// const {messageList} = storeToRefs(chatMessageStore);
const {chatConversation} = storeToRefs(chatMessageStore);


const handleSelectMessage = (messageId: number) => {
  selectedMessages.value.push(messageId);

  if (chatConversation.value && selectedMessages.value.length === chatConversation.value.messageList.length) {
    selectAll.value = true;
  }

  if (!selectMode.value) {
    selectMode.value = true;
  }
};

const handleDeselectMessage = (messageId: number) => {
  selectAll.value = false;
  selectedMessages.value = selectedMessages.value.filter(
      (item) => item !== messageId
  );

  if (chatConversation.value.messageList && selectedMessages.value.length === 0) {
    selectMode.value = false;
  }
};


// Reply message
const replyMessage = getMessageById(activeConversation, props.message.replyTo);
</script>


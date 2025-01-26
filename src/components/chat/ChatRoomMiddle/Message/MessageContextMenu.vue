<template>
  <!--custom context menu-->
  <Dropdown
      :close-dropdown="handleCloseContextMenu"
      :handle-click-outside="handleCloseContextMenu"
      :show="show"
      :coordinates="{
      left: props.left + 'px',
      top: props.top + 'px',
    }"
      :position="['top-0']"
  >
    <DropdownLink :handle-click="handleReplyToMessage">
      <ArrowUturnLeftIcon class="h-5 w-5 mr-3" />
      Reply
    </DropdownLink>

    <DropdownLink :handle-click="handleCloseContextMenu">
      <BookmarkIcon class="h-5 w-5 mr-3" />
      Copy
    </DropdownLink>

    <DropdownLink :handle-click="handlePinMessage">
      <BookmarkSquareIcon class="h-5 w-5 mr-3" />
      Pin
    </DropdownLink>

    <DropdownLink
        v-if="props.selected"
        :handle-click="
        () => {
          handleCloseContextMenu();
          props.handleDeselectMessage(props.message.id);
        }
      "
    >
      <XCircleIcon class="h-5 w-5 mr-3" />
      Deselect
    </DropdownLink>

    <DropdownLink
        v-else
        :handle-click="
        () => {
          handleCloseContextMenu();
          props.handleSelectMessage(props.message.id);
        }
      "
    >
      <CheckCircleIcon class="h-5 w-5 mr-3" />
      Select
    </DropdownLink>

    <DropdownLink :handle-click="handleCloseContextMenu" color="danger">
      <TrashIcon class="h-5 w-5 mr-3" />
      Delete Message
    </DropdownLink>
  </Dropdown>
</template>
<script setup lang="ts">
import {
  ArrowUturnLeftIcon,
  BookmarkIcon,
  BookmarkSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";
// import {IConversation, IMessage} from "~types/types.ts";
import useStore from "~store/store.ts";
import {getConversationIndex} from "~utils/utils.ts";
import DropdownLink from "~ui/navigation/Dropdown/DropdownLink.vue";
import Dropdown from "~ui/navigation/Dropdown/Dropdown.vue";
import {IChatMessage} from "~types/IChatMessage.ts";
import useChatConversationStore from "~store/useChatConversationStore.ts";
import {storeToRefs} from "pinia";

const props = defineProps<{
  message: IChatMessage;
  show: boolean;
  left: number;
  top: number;
  selected: boolean;
  handleCloseContextMenu: () => void;
  handleSelectMessage: (messageId: number) => void;
  handleDeselectMessage: (messageId: number) => void;
}>();

const chatMessageStore= useChatConversationStore();
const {chatConversation} = storeToRefs(chatMessageStore);




// (event) pin message to conversation
const handlePinMessage = () => {
  props.handleCloseContextMenu();

  if (chatConversation.value) {
    // get the active conversation index in the state store
    let activeConversationIndex = getConversationIndex(chatConversation.value);

    if (chatConversation.value && activeConversationIndex !== undefined && activeConversationIndex !== null) {
      // store.conversations[activeConversationIndex].pinnedMessage = props.message;
      // store.conversations[activeConversationIndex].pinnedMessageHidden = false;
    }
  }
};

// export const getConversationIndex = (conversationId: number): number | undefined => {
//   let conversationIndex;
//   const store = useStore();
//
//   // store.conversations.forEach((conversation, index) => {
//   //   if (conversation.id === conversationId) {
//   //     conversationIndex = index;
//   //   }
//   // });
//
//
//   return conversationIndex;
// };

// export const getConversationIndex = (
//     conversationId: number
// ): number | undefined => {
//   let conversationIndex;
//   const store = useStore();
//
//   store.conversations.forEach((conversation, index) => {
//     if (conversation.id === conversationId) {
//       conversationIndex = index;
//     }
//   });
//
//   return conversationIndex;
// };


// (event) select the reply message.
const handleReplyToMessage = () => {
  props.handleCloseContextMenu();

  if (chatConversation.value.messageList) {
    console.log("======= 선택 =======")
    chatConversation.value.replyMessage = props.message;
  }
};
</script>



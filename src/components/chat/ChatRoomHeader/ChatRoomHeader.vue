<template>
  <div class="w-full">
    <!--Top section-->
    <div class="w-full min-h-[84px] px-5 py-6">
      <SelectSection v-if="props.selectMode"
          :select-mode="props.selectMode"
          :select-all="props.selectAll"
          :handle-close-select="props.handleCloseSelect"
          :handle-select-all="props.handleSelectAll"
          :handle-deselect-all="props.handleDeselectAll"
      />
      <ConversationInfoSection
          v-else
          :handle-open-info="handleOpenInfo"
          :handle-open-search="handleOpenSearch"
      />
    </div>

<!--    &lt;!&ndash;Pinned Message&ndash;&gt;-->
<!--    <div-->
<!--        class="relative transition-[padding] duration-200"-->
<!--        :class="{-->
<!--        'pb-[60px]':-->
<!--          activeConversation.pinnedMessage &&-->
<!--          !activeConversation.pinnedMessageHidden,-->
<!--      }"-->
<!--    >-->
<!--      <PinnedMessage :active-conversation="activeConversation" />-->
<!--    </div>-->

<!--    &lt;!&ndash;Search modal&ndash;&gt;-->
<!--    <SearchModal-->
<!--        :open="openSearch"-->
<!--        :close-modal="() => (openSearch = false)"-->
<!--        :conversation="activeConversation"-->
<!--    />-->

<!--    &lt;!&ndash;Contact info modal&ndash;&gt;-->
<!--    <ConversationInfoModal-->
<!--        :open="openInfo"-->
<!--        :closeModal="() => (openInfo = false)"-->
<!--        :conversation="activeConversation"-->
<!--    />-->

<!--    &lt;!&ndash;voice call modal&ndash;&gt;-->
<!--    <VoiceCallModal-->
<!--        :open="store.openVoiceCall"-->
<!--        :close-modal="handleCloseVoiceCallModal"-->
<!--    />-->
  </div>
</template>
<script setup lang="ts">
import SelectSection from "~components/chat/ChatRoomHeader/SelectSection.vue";
import ConversationInfoSection from "~components/chat/ChatRoomHeader/ConversationInfoSection.vue";
import {ref} from "vue";

const props = defineProps<{
  selectMode: boolean;
  selectAll: boolean;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  handleCloseSelect: () => void;
}>();

const openSearch = ref(false);

const openInfo = ref(false);

// (event) open search modal
const handleOpenSearch = () => {
  openSearch.value = true;
};

// (event) open info modal
const handleOpenInfo = () => {
  openInfo.value = true;
};
</script>
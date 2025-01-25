<template xmlns="http://www.w3.org/1999/html">
  <!--  <div class="flex min-h-screen bg-gray-100">-->

  <!--  <div-->
  <!--      class="xs:relative md:static h-full flex xs:flex-col md:flex-row overflow-hidden"-->
  <!--  >-->
  <!--    <Sidebar/>-->
  <!--    <div-->
  <!--        class="xs:absolute xs:z-10 md:static grow h-full xs:w-full md:w-fit scrollbar-hidden bg-white dark:bg-gray-800 transition-all duration-500">-->
  <!--      &lt;!&ndash; 오른쪽 패널: 채팅 인터페이스 &ndash;&gt;-->
  <!--      <ChatRoom/>-->
  <!--    </div>-->
  <!--  </div>-->
  <div class="flex min-h-screen bg-gray-100">
    <Sidebar/>
    <ChatRoom/>
  </div>
</template>

<!--<template>-->
<!--  <div class="flex min-h-screen bg-gray-100">-->

<!--    &lt;!&ndash;  <div class="xs:relative md:static h-full flex xs:flex-col md:flex-row overflow-hidden">&ndash;&gt;-->
<!--    <Sidebar/>-->
<!--    <div-->
<!--        class="xs:left-[0px] xs:static xs:z-10 md:static grow h-full xs:w-full md:w-fit scrollbar-hidden bg-white dark:bg-gray-800 transition-all duration-500">-->
<!--      &lt;!&ndash; 오른쪽 패널: 채팅 인터페이스 &ndash;&gt;-->
<!--      <ChatRoom/>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<script setup lang="ts">

import {connect} from "../utils/useStomp.ts";
import {computed, onMounted, provide} from "vue";
import axios from "axios";
import ChatRoom from "~components/chat/ChatRoom.vue";
import useStore from "~store/store.ts";
import Sidebar from "~components/sidebar/Sidebar.vue";


connect();
axios.defaults.baseURL = "http://127.0.0.1:8080";


onMounted(async () => {
});

const store = useStore();

const activeConversation = computed(() => {
  let activeConversation = store.conversations.find(
      (conversation) => conversation.id === store.activeConversationId
  );

  if (activeConversation) {
    return activeConversation;
  } else {
    return store.archivedConversations.find(
        (conversation) => conversation.id === store.activeConversationId
    );
  }
});


provide("activeConversation", activeConversation.value);

</script>

<style scoped></style>

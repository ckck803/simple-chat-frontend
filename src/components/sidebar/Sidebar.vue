<template>
  <div class="w-full bg-white p-6 rounded shadow-md max-w-xs">
    <div v-if="userInfo.username">
      <div class="flex flex-col justify-center items-center">
        <img :src="defaultImage" class="w-[90px] h-[90px] bg-cover bg-center rounded-full"/>
      </div>


      <div class="bg-white px-8 py-5 rounded mb-4">
        <h2 class="text-2xl font-bold mb-2">
          {{ `사용자: ${userInfo.username} 님` }}
        </h2>
      </div>

      <div class="flex flex-col space-y-4">
        <button
            type="button"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            @click.prevent="logout"
        >
          로그아웃
        </button>
      </div>
    </div>
    <div v-else>
      <div class="bg-white py-2 rounded mb-4" v-if="!isSignup">
        <Login :goToSignup="goToSignup"/>
      </div>
      <div class="bg-white py-2 rounded mb-6" v-else>
        <Signup :goToSignup="goToSignup"/>
      </div>
    </div>

    <!-- 굵은 라인 추가 -->
    <hr class="border-t-4 border-gray-300 my-6"/>

    <ChatRoomList/>
  </div>
</template>
<script setup lang="ts">
import ChatRoomList from "~components/chat/ChatRoomList.vue";
import {ref} from "vue";
import Login from "~components/sidebar/Login.vue";
import Signup from "~components/sidebar/Signup.vue";
import useUserInfoStore from "~store/useUserInfoStore.ts";
import {storeToRefs} from "pinia";
import defaultImage from "~assets/image/default_image.jpg";

const isSignup = ref(false);
const userInfoStore = useUserInfoStore();
const {logout} = useUserInfoStore();
const {userInfo} = storeToRefs(userInfoStore);

function goToSignup() {
  isSignup.value = !isSignup.value;
}


</script>
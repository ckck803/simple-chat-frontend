<template>
  <h2 class="text-2xl font-bold mb-4">로그인</h2>
  <div class="flex flex-col space-y-4">
    <div>
      <label for="roomName" class="block text-gray-700 font-medium"
      >Id</label
      >
      <input
          id="email"
          v-model="email"
          type="text"
          class="w-full p-3 border border-gray-300 rounded mt-1"
          placeholder="이메일을 입력하세요"
          required
      />
      <label for="password" class="block text-gray-700 font-medium"
      >Password</label
      >
      <input
          id="password"
          v-model="password"
          type="password"
          class="w-full p-3 border border-gray-300 rounded mt-1"
          placeholder="패스워드를 입력하세요"
          required
      />
    </div>
    <button
        type="button"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        @click.prevent="login({email, password})"
    >
      로그인
    </button>
  </div>
  <div class="mt-4 text-center">
    <button
        class="text-sm text-blue-500 hover:underline"
        @click="goToSignup"
    >
      회원가입
    </button>
  </div>
</template>
<script setup lang="ts">

import {ref} from "vue";
import useUserInfoStore from "~store/useUserInfoStore.ts";

const {goToSignup} = defineProps(['goToSignup']);

const email = ref("");
const password = ref("");
const {login} = useUserInfoStore();
</script>
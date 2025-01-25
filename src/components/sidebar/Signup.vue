<template>
  <h2 class="text-2xl font-bold mb-4">회원가입</h2>
  <div class="flex flex-col space-y-4">
    <div>
      <label for="roomName" class="block text-gray-700 font-medium"
      >이름</label
      >
      <input
          id="이름"
          v-model="username"
          type="text"
          class="w-full p-2 border border-gray-300 rounded mt-1"
          placeholder="이름을 입력하세요"
          required
      />
      <label for="roomName" class="block text-gray-700 font-medium"
      >Id</label
      >
      <input
          id="email"
          v-model="email"
          type="text"
          class="w-full p-2 border border-gray-300 rounded mt-1"
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
          class="w-full p-2 border border-gray-300 rounded mt-1"
          placeholder="패스워드를 입력하세요"
          required
      />
    </div>
    <button
        type="button"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        @click.prevent="signup"
    >
      회원가입
    </button>
  </div>
  <div class="mt-4 text-center">
    <button
        class="text-sm text-blue-500 hover:underline"
        @click="goToSignup"
    >
      로그인
    </button>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import axios from "axios";

const {goToSignup} = defineProps(['goToSignup']);

const username = ref("");
const email = ref("");
const password = ref("");

async function signup() {
  const param = {
    username: username.value,
    password: password.value,
    email: email.value,
  };
  axios.post("/api/signup", param).then((res) => {
    alert(res.data.body);
    goToSignup();
  });
}
</script>
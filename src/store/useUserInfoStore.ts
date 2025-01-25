import {ILoginType, IUserInfo} from "../types/IUserInfo.ts";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import axios from "axios";

const userInfoSessionStoreKey = "chat-user-session-key";
const userInfoStoreKey = "chat-user-key";


const store = defineStore(userInfoStoreKey, () => {
  const userInfo = ref(getUserInfoSessionStore());

  const getUserInfo = computed(() => userInfo)
  const setUserInfo =  (user: IUserInfo) => {
      setUserInfoSessionStore(user);
      userInfo.value = user;
  }

  const login = async ({email, password}: ILoginType) => {
    const param = {
      email: email,
      password: password,
    };
    await axios.post("/api/login", param).then((res) => {
      setUserInfo(res.data);
    });
  }

  const logout = async () => {
    sessionStorage.removeItem(userInfoSessionStoreKey)
    userInfo.value = {
      userId: "",
      username: "",
      email: "",
    }

    // await axios.post("/api/logout").then((res) => {
    //   setUserInfo(res.data);
    // });
  }

  function setUserInfoSessionStore(userInfo: IUserInfo) {
    sessionStorage.setItem(userInfoSessionStoreKey, JSON.stringify(userInfo))
  }

  function getUserInfoSessionStore() {
    let userInfo: IUserInfo = {
      userId: "",
      username: "",
      email: "",
    };

    if (sessionStorage.getItem(userInfoSessionStoreKey)) {
      userInfo = JSON.parse(<string> sessionStorage.getItem(userInfoSessionStoreKey));
    }

    return userInfo;
  }

  return{
    userInfo,
    getUserInfo,
    setUserInfo,
    login,
    logout
  }
})

export default store;

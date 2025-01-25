import {Client} from '@stomp/stompjs'
import {IChatMessage} from "~types/IChatMessage.ts";
import {IChatRoom} from "~types/IChatRoom.ts";
import {Ref} from "vue";
import {IChatRoomProtocol} from "~types/IChatRoomProtocol.ts";

const brokerUrl = "ws://localhost:8080/ws-stomp"
const client = new Client({brokerURL: brokerUrl})

client.activate();

const connect = () => {
  client.onConnect = () => {
    console.log("======== 소켓에 연결 됐습니다. ========")
  }
}

// const subscribe = async (roomId: string, messages: { [key: string]: IChatMessage[] }, onMessageReceived:(message: IChatMessage) => void ) => {
const subscribe = async (roomId: string, messages: Ref<{ [key: string]: IChatMessage[] }>, onMessageReceived:(message: IChatMessage) => void ) => {
  console.log("subscribe: %o", roomId)
  console.log(`/sub/chatroom/${roomId}`)

  await client.subscribe(`/sub/chatroom/${roomId}`, (res) => {
    const message = JSON.parse(res.body);
    console.log("subscirbe message %o", message)
    messages.value[message.roomId].push(message)
    onMessageReceived(message)
  })
}

const publish = (message: IChatMessage) => {
  client.publish({
    destination: `/pub/message`,
    body: JSON.stringify(message)
  })
}


// const subscribeChatRoom = async (userId: string, chatRoomList: Ref<IChatRoom[]>) => {
//   console.log("subscribe chat Room: %o", userId)
//   console.log(`/sub/user/${userId}`)
//
//   await client.subscribe(`/sub/user/${userId}`, (res) => {
//     const chatRoom = JSON.parse(res.body);
//     console.log("subscirbe chatRoom %o", chatRoom)
//     chatRoomList.value.push(chatRoom);
//   })
// }

// const subscribeChatRoom = async (chatRoomList: Ref<IChatRoom[]>) => {
//   console.log("subscribe chat Room")
//
//   await client.subscribe(`/sub/chat/room`, (res) => {
//     const chatRoom = JSON.parse(res.body);
//     console.log("subscirbe chatRoom %o", chatRoom)
//     chatRoomList.value.push(chatRoom);
//   })
// }

const subscribeChatRoom = async (chatRoomList: Ref<IChatRoom[]>) => {
  console.log("subscribe chat Room")

  await client.subscribe(`/sub/chat/room`, (res) => {
    console.log("subscribe chat Room protocol: %o", res.body)

    const chatRoomProtocol = JSON.parse(res.body) as IChatRoomProtocol;

    if(chatRoomProtocol.requestType === "CREATE"){
      console.log("subscirbe chatRoom %o", chatRoomProtocol)
      chatRoomList.value.push({name: chatRoomProtocol.name, roomId: chatRoomProtocol.roomId!, userCount: 0});
    }

    if(chatRoomProtocol.requestType === "DELETE"){
      console.log("subscirbe chatRoom %o", chatRoomProtocol)
      chatRoomList.value = chatRoomList.value.filter(chatRoom => chatRoom.roomId !== chatRoomProtocol.roomId)
    }
  })
}

// const publishChatRoom = (roomName: string) => {
//   console.log("publish chat room: %o", roomName)
//   const params = {
//     name: roomName,
//   };
//
//
//   client.publish({
//     destination: `/pub/chat/room`,
//     body: JSON.stringify(params)
//   })
//
//   alert("채팅방 개설에 성공 했습니다.");
// }

const publishChatRoom = (chatRoomProtocol: IChatRoomProtocol) => {
  console.log("publish chat room: %o", chatRoomProtocol)


  client.publish({
    destination: `/pub/chat/room`,
    body: JSON.stringify(chatRoomProtocol)
  })

  // alert("채팅방 개설에 성공 했습니다.");
}

export {connect, subscribe, publish, subscribeChatRoom, publishChatRoom}
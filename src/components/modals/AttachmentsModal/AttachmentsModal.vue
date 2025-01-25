<template>
  <Modal :open="props.open" :close-modal="props.closeModal">
    <template v-slot:content>
      <div class="w-[400px] bg-white dark:bg-gray-800 rounded py-6">
        <!--attachments list-->
        <ScrollBox class="max-h-[140px] overflow-y-scroll">
          <!--          <Attachment-->
          <!--              v-for="(attachment, index) in attachments"-->
          <!--              :attachment="attachment"-->
          <!--              :key="index"-->
          <!--          />-->
          <Attachment
              v-for="(file, index) in uploadedFiles"
              :attachment="file"
              :key="index"
          />
        </ScrollBox>

        <!--caption button-->
        <div class="px-5 py-6">
          <TextInput placeholder="Caption" type="text" v-model="message" :value="message"/>
<!--          <TextInput placeholder="Caption" type="text" :value="message"/>-->
        </div>

        <!--Action buttons-->
        <div class="flex w-full px-5">
          <!-- 숨겨진 파일 입력 요소 -->
          <input
              ref="fileInput"
              type="file"
              class="hidden"
              @change="handleFileUpload"
              multiple
          />

          <div class="grow flex justify-start">
            <Button variant="ghost" @click="triggerFileInput"> Add</Button>
          </div>

          <Button variant="ghost" @click="props.closeModal" class="mr-4">
            Cancel
          </Button>

          <Button @click="uploadFile"> Send</Button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">

// import Attachment from "@src/components/shared/modals/AttachmentsModal/Attachment.vue";
// import Modal from "@src/components/ui/utils/Modal.vue";
// import ScrollBox from "@src/components/ui/utils/ScrollBox.vue";
import Attachment from "~components/modals/AttachmentsModal/Attachment.vue";
import TextInput from "~ui/inputs/TextInput.vue";
import Modal from "~ui/utils/Modal.vue";
import ScrollBox from "~ui/utils/ScrollBox.vue";
import Button from "~ui/inputs/Button.vue";

const props = defineProps<{
  open: boolean;
  closeModal: () => void;
}>();

import {ref} from 'vue';
import {IAttachment} from "~types/types.ts";
import axios, {AxiosProgressEvent} from "axios";
import usePageStore from "~store/usePageStore.ts";
import {storeToRefs} from "pinia";
import useUserInfoStore from "~store/useUserInfoStore.ts";
import {getCurrentDate, getCurrentTime} from "~utils/dateUtils.ts";

const pageStore = usePageStore();
const {chatRoom} = storeToRefs(pageStore);

// const {chatRoom} = usePageStore();
const userInfoStore = useUserInfoStore();
const {userInfo} = storeToRefs(userInfoStore);

// 숨겨진 파일 입력 요소 참조
const fileInput = ref<HTMLInputElement | null>(null);

// 업로드된 파일 목록
// const uploadedFiles = ref<UploadedFile[]>([]);
const uploadedFiles = ref<IAttachment[]>([]);

const message = ref("");

// 파일 선택 창 열기
const triggerFileInput = (): void => {
  fileInput.value?.click();
};

// 파일 업로드 처리
const handleFileUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    let count = 0;
    const files = Array.from(target.files).map(file => ({
      id: count++,
      type: file.type,
      name: file.name,
      size: getFileSize(file.size),
      file: file,
      url: URL.createObjectURL(file)
    }));

    uploadedFiles.value = [
      ...uploadedFiles.value,
      ...files
    ];

    console.log("files =====> ", files)
  }

  function getFileSize(size: number) {
    return (size / (1024 * 1024)).toFixed(2) + " MB"
  }
};

const progress = ref<number>(0);

// 파일 업로드 처리
const uploadFile = async (): Promise<void> => {
  if (!uploadedFiles.value) {
    return;
  }

  console.log("message ===> ", message.value)

  const chatMessage = {
    roomId: chatRoom.value!.roomId,
    userId: userInfo.value.userId,
    message: message.value,
    sendDate: getCurrentDate(),
    sendTime: getCurrentTime(),
    sender: userInfo.value.username
  }

  const formData = new FormData();
  uploadedFiles.value.forEach(uploadFile => {
    formData.append("files", uploadFile.file!);
  })

  formData.append("chatMessage", new Blob([JSON.stringify(chatMessage)], { type: "application/json" }));



  try {
    const response = await axios.post("/api/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total !== undefined) {

          // 진행률 계산
          progress.value = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
          );
        } else {
          progress.value = 0;
        }
      },
    });

    // alert(response.data);
    console.log("==========> %o", response.data);

  } catch (error) {
    console.error(error);
    alert("File upload failed.");
  }
};


</script>


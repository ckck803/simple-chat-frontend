<template>
  <div>
    <div class="flex">
      <div
          v-for="(file, index) in fileList"
          :key="index"
          class="mr-2 flex items-end"
          :class="{ 'mt-4': true }"
      >
        <!--image-->
        <button
            v-if="file.fileType ==='image'"
            class="outline-none"
            @click="openCarouselWithAttachment(file.fileName)"
        >
          <div
              v-if="!isNumber(file.fileName, 2, true)"
              :style="{ backgroundImage: `url(http://localhost:8080/api/file/${file.fileName})` }"
              class="rounded bg-cover bg-center"
              :class="
              numberOfMedia === 1
                ? ['w-[200px]', 'h-[200px]']
                : [
                    'md:w-[110px]',
                    'md:h-[100px]',
                    'xs:w-[100px]',
                    'xs:h-[95px]',
                  ]
            "
          >
            <div
                v-if="isNumber(file.fileName, 1)"
                class="w-full h-full flex justify-center items-center rounded bg-black bg-opacity-20 hover:bg-opacity-10 transition duration-200"
            ></div>
            <!--more images overlay-->
            <div
                v-if="isNumber(file.fileName, 2) && numberOfMedia > 2"
                class="w-full h-full flex items-center justify-center rounded bg-black bg-opacity-40 text-white hover:bg-opacity-10 transition duration-200"
            >
              {{ (props.fileList as []).length - 1 }}+
            </div>
          </div>
        </button>

        <!--file-->
        <div v-if="file.fileType === 'file' && !containsMedia">
          <div class="flex">
            <!--download button / icons-->
            <button
                @click="downloadFile(file)"
                class="w-8 h-8 mr-4 flex justify-center rounded-full outline-none items-center duration-200"
                :class="
                        props.self
                          ? ['bg-indigo-300']
                          : [
                              'bg-indigo-50',
                              'hover:bg-indigo-100',
                              'active:bg-indigo-200',
                              'dark:bg-gray-400',
                              'dark:hover:bg-gray-300',
                              'dark:focus:bg-gray-300',
                              'dark:active:bg-gray-200',
                            ]
                      "
            >
              <ArrowDownTrayIcon
                  class="stroke-2 h-5 w-5"
                  :class="
                          props.self
                            ? ['text-white']
                            : ['text-blue-500', 'dark:text-gray-50']
                        "
              />
            </button>

            <div class="flex flex-col justify-center">
              <Typography
                  variant="heading-2"
                  :no-color="true"
                  class="mb-3"
                  :class="
                          props.self
                            ? ['text-black opacity-50 dark:text-white dark:opacity-70 ']
                            : [
                                'text-black',
                                'opacity-50',
                                'dark:text-white',
                                'dark:opacity-70',
                              ]
                        "
              >
                {{ file.fileName }}
              </Typography
              >

              <Typography
                  variant="body-2"
                  :no-color="true"
                  :class="
                          props.self
                            ? ['text-black opacity-60 dark:text-white dark:opacity-70']
                            : [
                                'text-black',
                                'opacity-50',
                                'dark:text-white',
                                'dark:opacity-70',
                              ]
                        "
              >
                {{ file.fileSize }}
              </Typography>
            </div>
          </div>
        </div>

        <!--image-->
        <!--        <button-->
        <!--            v-if="attachment.type === 'image'"-->
        <!--            @click="openCarouselWithAttachment(attachment.id)"-->
        <!--            class="outline-none"-->
        <!--            :aria-label="numberOfMedia > 2 ? (props.message.attachments as []).length - 1 + ' more attachments' : attachment.name"-->
        <!--        >-->
        <!--          <div-->
        <!--              v-if="!isNumber(attachment, 2, true)"-->
        <!--              :style="{ backgroundImage: `url(${attachment.url})` }"-->
        <!--              class="rounded bg-cover bg-center"-->
        <!--              :class="-->
        <!--              numberOfMedia === 1-->
        <!--                ? ['w-[200px]', 'h-[200px]']-->
        <!--                : [-->
        <!--                    'md:w-[110px]',-->
        <!--                    'md:h-[100px]',-->
        <!--                    'xs:w-[100px]',-->
        <!--                    'xs:h-[95px]',-->
        <!--                  ]-->
        <!--            "-->
        <!--          >-->
        <!--            &lt;!&ndash;first image&ndash;&gt;-->
        <!--            <div-->
        <!--                v-if="isNumber(attachment, 1)"-->
        <!--                class="w-full h-full flex justify-center items-center rounded bg-black bg-opacity-20 hover:bg-opacity-10 transition duration-200"-->
        <!--            ></div>-->

        <!--            &lt;!&ndash;more images overlay&ndash;&gt;-->
        <!--            <div-->
        <!--                v-if="isNumber(attachment, 2) && numberOfMedia > 2"-->
        <!--                class="w-full h-full flex items-center justify-center rounded bg-black bg-opacity-40 text-white hover:bg-opacity-10 transition duration-200"-->
        <!--            >-->
        <!--              {{ (props.message.attachments as []).length - 1 }}+-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </button>-->


        <!--video-->
        <!--        <button-->
        <!--            v-if="attachment.type === 'video'"-->
        <!--            @click="openCarouselWithAttachment(attachment.id)"-->
        <!--            class="overflow-hidden outline-none"-->
        <!--            :aria-label="numberOfMedia > 2 ? (props.message.attachments as []).length - 1 + ' more attachments' : attachment.name"-->
        <!--        >-->
        <!--          <div-->
        <!--              v-if="!isNumber(attachment, 2, true)"-->
        <!--              :style="{ backgroundImage: `url(${attachment.thumbnail})` }"-->
        <!--              class="rounded bg-cover bg-center"-->
        <!--              :class="-->
        <!--              numberOfMedia === 1-->
        <!--                ? ['w-[200px]', 'h-[200px]']-->
        <!--                : [-->
        <!--                    'md:w-[110px]',-->
        <!--                    'md:h-[100px]',-->
        <!--                    'xs:w-[100px]',-->
        <!--                    'xs:h-[95px]',-->
        <!--                  ]-->
        <!--            "-->
        <!--          >-->
        <!--            &lt;!&ndash;first video&ndash;&gt;-->
        <!--            <div-->
        <!--                v-if="isNumber(attachment, 1)"-->
        <!--                class="w-full h-full flex justify-center items-center rounded bg-black bg-opacity-20 hover:bg-opacity-10 transition duration-200"-->
        <!--            >-->
        <!--              <span-->
        <!--                  class="p-3 rounded-full bg-white bg-opacity-40 transition-all duration-200"-->
        <!--              >-->
        <!--                <PlayIcon class="w-5 h-5 text-white"/>-->
        <!--              </span>-->
        <!--            </div>-->

        <!--second video-->
        <!--            <div-->
        <!--                v-else-if="isNumber(attachment, 2) && numberOfMedia < 3"-->
        <!--                class="w-full h-full flex justify-center items-center rounded bg-black bg-opacity-20 hover:bg-opacity-10 transition duration-200"-->
        <!--            >-->
        <!--              <span-->
        <!--                  class="p-3 rounded-full bg-white bg-opacity-40 transition-all duration-200"-->
        <!--              >-->
        <!--                <PlayIcon class="w-5 h-5 text-white"/>-->
        <!--              </span>-->
        <!--            </div>-->

        <!--            &lt;!&ndash;more videos overlay&ndash;&gt;-->
        <!--            <div-->
        <!--                v-else-if="isNumber(attachment, 2) && numberOfMedia > 2"-->
        <!--                class="w-full h-full flex items-center justify-center rounded bg-black bg-opacity-40 text-white hover:bg-opacity-10 transition duration-200"-->
        <!--            >-->
        <!--              {{ (props.message.attachments as []).length - 1 }}+-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </button>-->

      </div>

      <!--carousel modal-->
      <!--      <Carousel-->
      <!--          :open="openCarousel"-->
      <!--          :starting-id="(selectedAttachmentId as number)"-->
      <!--          :close-carousel="closeCarousel"-->
      <!--      />-->
    </div>
  </div>
</template>


<script setup lang="ts">
import {ArrowDownTrayIcon} from "@heroicons/vue/24/outline";
import {PlayIcon} from "@heroicons/vue/24/solid";
import {onMounted, Ref} from "vue";
import {computed, ref} from "vue";

// export interface IMessage {
//   id: number;
//   type?: string;
//   content?: string | IRecording;
//   date: string;
//   sender: IContact;
//   replyTo?: number;
//   previewData?: IPreviewData;
//   attachments?: IAttachment[];
//   state: string;
// }

// export interface IAttachment {
//   id: number;
//   type: string;
//   name: string;
//   size: string;
//   url: string;
//   thumbnail?: string;
//   file?: File;
// }


import {IAttachment, IContact, IMessage, IPreviewData, IRecording} from "~types/types.ts";
import Typography from "~ui/data-display/Typography.vue";
import Carousel from "~ui/data-display/Carousel/Carousel.vue";
import axios from "axios";
import {reset} from "linkifyjs";
import {IFileInfo} from "~types/IFileInfo.ts";

// const props = defineProps<{
//   message: IMessage;
//   self?: boolean;
// }>();

const props = defineProps<{
  fileList: IFileInfo[];
  self?: boolean;
}>();


onMounted(() => {
  // console.log("fileList ====> %o", props.fileList)
})

// const imageList = ref([]);

// const getImageList
// () => {
//   // "localhost:8080/api/file/a266c06a-5644-4646-b0ac-20505ce555c6.jpeg"
//   axios.get("/api/file/").then(res => {
//     imageList.value = res.data;
//     console.log(res.data);
//   })
//
// }


const openCarousel: Ref<boolean> = ref(false);

// const selectedAttachmentId: Ref<number | undefined> = ref();

// open the carousel with the selected index
// const openCarouselWithAttachment = (attachmentId: number) => {
//   selectedAttachmentId.value = attachmentId;
//   openCarousel.value = true;
// };

const selectedAttachmentId: Ref<string | undefined> = ref();

const openCarouselWithAttachment = (url: string) => {
  selectedAttachmentId.value = url;
  openCarousel.value = true;
};


// close the carousel
const closeCarousel = () => {
  openCarousel.value = false;
};

// // check if the message contians images or videos
//
// // number of videos attached to this message.
// const numberOfMedia = computed(() => {
//   let counter = 0;
//
//   if (props.message.attachments) {
//     for (let attachment of props.message.attachments) {
//       if (["video", "image"].includes(attachment.type)) {
//         counter += 1;
//       }
//     }
//   }
//
//   return counter;
// });
//
// // (event) test is the attachment is the second media item.
// const isNumber = (
//     attachment: IAttachment,
//     number: number,
//     largerThan?: boolean
// ) => {
//   let counter = 0;
//   let caseCorrect = false;
//
//   if (props.message.attachments) {
//     for (let item of props.message.attachments) {
//       if (["video", "image"].includes(item.type)) {
//         counter += 1;
//
//         if (largerThan) {
//           if (item.id === attachment.id && counter > number) {
//             caseCorrect = true;
//           }
//         } else {
//           if (item.id === attachment.id && counter === number) {
//             caseCorrect = true;
//           }
//         }
//       }
//     }
//   }
//
//   return caseCorrect;
// };

const containsMedia = computed(() => {
  if (props.fileList) {
    for (let file of props.fileList) {
      if (["image", "video"].includes(file.fileType)) return true;
    }
  }
  return false;
});

// number of videos attached to this message.
const numberOfMedia = computed(() => {
  let counter = 0;

  if (props.fileList) {
    for (let file of props.fileList) {
      counter += 1;

    }
  }

  return counter;
});

const isNumber = (
    fileName: string,
    number: number,
    largerThan?: boolean
) => {
  let counter = 0;
  let caseCorrect = false;

  if (props.fileList) {
    for (let file of props.fileList) {
      counter += 1;
      if (largerThan) {
        if (file.fileName === fileName && counter > number) {
          caseCorrect = true;
        }
      } else {
        if (file.fileName === fileName && counter === number) {
          caseCorrect = true;
        }
      }
    }
  }

  // if (props.message.attachments) {
  //   for (let item of props.message.attachments) {
  //     if (["video", "image"].includes(item.type)) {
  //       counter += 1;
  //
  //       if (largerThan) {
  //         if (item.id === attachment.id && counter > number) {
  //           caseCorrect = true;
  //         }
  //       } else {
  //         if (item.id === attachment.id && counter === number) {
  //           caseCorrect = true;
  //         }
  //       }
  //     }
  //   }
  // }

  return caseCorrect;
};

const downloadFile = async (file: IFileInfo) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/file/${file.fileName}`, {
      responseType: "blob", // Blob 형태로 응답받기
    });

    const blob = new Blob([response.data], {type: response.data.type});

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file.fileName);
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("파일 다운로드 실패:", error);
  }
}

</script>


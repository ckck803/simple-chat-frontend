<template>
  <div
      v-if="props.message"
      class="border-l-2 pl-3 cursor-pointer outline-none border-opacity-50 duration-200"
      :class="['border-gray-900', 'dark:border-white', 'dark:border-opacity-50']"
      tabindex="0"
      :aria-label="'reply to: ' + props.message.sender"
  >
    <!--name-->
    <p
        class="mb-3 font-semibold text-xs leading-4 tracking-[0.16px]"
        :class="[
        'text-black',
        'opacity-60',
        'dark:text-white',
        'dark:opacity-70',
      ]"
    >
<!--      {{-->
<!--        store.user && message.sender.id !== store.user.id-->
<!--            ? getFullName(props.message.sender)-->
<!--            : "You"-->
<!--      }}-->
      {{
        message.userId !== userInfo.userId
            ? props.message.sender
            : "You"
      }}

    </p>

    <!--content-->
    <Typography
        v-if="props.message.message"
        variant="body-2"
        :no-color="true"
        class="text-black opacity-50 dark:text-white dark:opacity-70"
    >
      {{ shorten(props.message.message, 60) }}
    </Typography>

<!--    &lt;!&ndash;attachments title&ndash;&gt;-->
<!--    <Typography-->
<!--        v-else-if="hasAttachments(props.message)"-->
<!--        variant="body-2"-->
<!--        class="text-black opacity-50 dark:text-white dark:opacity-70"-->
<!--    >-->
<!--      {{ (props.message?.attachments as IAttachment[])[0].name }}-->
<!--    </Typography>-->

<!--    &lt;!&ndash;recording title&ndash;&gt;-->
<!--    <Typography-->
<!--        v-else-if="props.message.type === 'recording'"-->
<!--        variant="body-2"-->
<!--        class="text-black opacity-50 dark:text-white dark:opacity-70"-->
<!--    >-->
<!--      recording 23s-->
<!--    </Typography>-->
  </div>
</template>

<script setup lang="ts">
// import type { IAttachment, IChatMessage, IUser } from "@src/types";

// import useStore from "@src/store/store";
// import { getFullName, hasAttachments, shorten } from "@src/utils";

import useStore from "~store/store.ts";
import {getFullName, hasAttachments, shorten} from "~utils/utils.ts";
import Typography from "~ui/data-display/Typography.vue";
import {IChatMessage} from "~types/IChatMessage.ts";
import useUserInfoStore from "~store/useUserInfoStore.ts";
import {storeToRefs} from "pinia";

// const props = defineProps<{
//   message: IMessage;
//   self?: boolean;
// }>();

const props = defineProps<{
  message: IChatMessage;
  self?: boolean;
}>();

const userInfoStore = useUserInfoStore();
const {userInfo} = storeToRefs(userInfoStore);

</script>



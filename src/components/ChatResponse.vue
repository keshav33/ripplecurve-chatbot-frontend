<script setup>
import { updateFeedback } from "@/api/chat";
import VueMarkdown from "vue-markdown-render";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";

const route = useRoute();
const toast = useToast();
const { chat, loading, updateChatsForFeedback } = defineProps({
  chat: {
    type: Object,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  updateChatsForFeedback: {
    type: Function,
  },
});

const chatClass = {
  "user-message": chat.type === "user",
  "assistant-message": chat.type === "assistant",
};

const handleFeedback = async (messageId, feedback) => {
  try {
    await updateFeedback({
      threadId: route.params.threadId,
      messageId,
      feedback,
    });
    updateChatsForFeedback(messageId, feedback);
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error submitting feedback",
      life: 3000,
    });
  }
};

const isCopied = ref(false);

const handleCopy = () => {
  navigator.clipboard.writeText(chat.text);
  isCopied.value = true;
  setTimeout(() => {
    isCopied.value = false;
  }, 3000);
};
</script>

<template>
  <div :class="chatClass">
    <div v-if="chat.type === 'user'">
      {{ chat.text }}
    </div>
    <div v-else-if="chat.type === 'assistant'">
      <div v-if="chat.isWebSearch">
        <div v-if="loading" class="searching-web">
          <i class="pi pi-spin pi-globe" style="margin-right: 8px"></i>
          Searching the web...
        </div>
      </div>
      <div v-if="chat.urls && chat.urls.length > 0" class="web-results">
        <div class="url-chip-list">
          <a
            v-for="url in chat.urls"
            :key="url"
            :href="url"
            target="_blank"
            class="url-chip"
            :title="url"
          >
            {{ url.length > 40 ? url.slice(0, 37) + "..." : url }}
          </a>
        </div>
      </div>
      <VueMarkdown :source="chat.text" />
    </div>
    <div v-if="chat.type === 'assistant' && !loading" style="margin-top: 12px">
      <i
        style="margin-right: 12px"
        :class="['pi', isCopied ? 'pi-check' : 'pi-copy']"
        @click="handleCopy"
      ></i>
      <i
        style="margin-right: 12px"
        :class="[
          'pi',
          chat.feedback === 'positive' ? 'pi-thumbs-up-fill' : 'pi-thumbs-up',
        ]"
        @click="handleFeedback(chat.id, 'positive')"
      ></i>
      <i
        :class="[
          'pi',
          chat.feedback === 'negative'
            ? 'pi-thumbs-down-fill'
            : 'pi-thumbs-down',
        ]"
        @click="handleFeedback(chat.id, 'negative')"
      ></i>
    </div>
  </div>
</template>

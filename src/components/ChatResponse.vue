<script setup>
import VueMarkdown from "vue-markdown-render";
const { chat, loading } = defineProps({
  chat: {
    type: Object,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const chatClass = {
  "user-message": chat.type === "user",
  "assistant-message": chat.type === "assistant",
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
      <i style="margin-right: 12px" class="pi pi-copy"></i>
      <i style="margin-right: 12px" class="pi pi-thumbs-up"></i>
      <i class="pi pi-thumbs-down"></i>
    </div>
  </div>
</template>

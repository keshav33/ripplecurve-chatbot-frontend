<script setup>
import { defineProps, watch } from "vue";
import "../styles/chatContainer.css";
import ChatResponse from "./ChatResponse.vue";
import { useAutoScroll } from "../composable/useAutoScroll";

const { chats, loading } = defineProps({
  chats: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const { chatContainerRef } = useAutoScroll();
</script>

<template>
  <div class="chat-container" ref="chatContainerRef">
    <div v-for="chat in chats">
      <ChatResponse :chat="chat" :loading="loading"></ChatResponse>
    </div>

    <!-- Loading dots animation -->
    <div v-if="loading" class="loading-container">
      <div class="loading-dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import "../styles/chatContainer.css"
import ChatResponse from './ChatResponse.vue';
const { chats, loading } = defineProps({
  chats: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
    <div class="chat-container">
        <div v-for="chat in chats">
            <ChatResponse :chat="chat"></ChatResponse>
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
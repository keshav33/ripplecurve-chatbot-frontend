<script setup>
import Header from '../components/Header.vue';
import Welcome from '@/components/Welcome.vue';
import ChatInput from '@/components/ChatInput.vue';
import ChatContainer from "@/components/ChatContainer.vue";
import Footer from '@/components/Footer.vue';
import "../styles/chat.css";
import InitialSuggestion from '@/components/InitialSuggestion.vue';
import { ref } from "vue";

const chats = ref([]);
const chatHistory = ref([
    {
        id: "1",
        title: "New Chat 1"
    },
    {
        id: "2",
        title: "New Chat 2"
    },
    {
        id: "3",
        title: "New Chat 3"
    }
]);

const loading = ref(false);

const submitChat = (chat, type) => {
    chats.value.push({
        type,
        text: chat
    })
    loading.value = true
    setTimeout(() => {
        chats.value.push({
            type: "assistant",
            text: "This is a dummy response"
        })
        loading.value = false
    }, 3000)
}

const handleNewChat = () => {
    chats.value = []
}

</script>

<template>
    <Header @new-chat="handleNewChat" :chatHistory></Header>
    <div class="chat-wrapper">
        <Welcome v-if="chats.length == 0"></Welcome>
        <ChatContainer v-if="chats.length > 0" :chats="chats" :loading="loading"></ChatContainer>
        <ChatInput :chats="chats" :loading="loading" @submit-chat="submitChat($event, 'user')"></ChatInput>
        <InitialSuggestion v-if="chats.length === 0"></InitialSuggestion>
        <Footer></Footer>
    </div>
</template>
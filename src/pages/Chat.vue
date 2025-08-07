<script setup>
import Header from "../components/Header.vue";
import Welcome from "@/components/Welcome.vue";
import ChatInput from "@/components/ChatInput.vue";
import ChatContainer from "@/components/ChatContainer.vue";
import Footer from "@/components/Footer.vue";
import "../styles/chat.css";
import InitialSuggestion from "@/components/InitialSuggestion.vue";
import { ref } from "vue";
import { getChatStreamEvent } from "@/api/chat";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "vue-router";

const router = useRouter();

const chats = ref([]);
const threadId = ref(router?.params?.threadId || "");
const chatHistory = ref([
  {
    id: "1",
    title: "New Chat 1",
  },
  {
    id: "2",
    title: "New Chat 2",
  },
  {
    id: "3",
    title: "New Chat 3",
  },
]);

const loading = ref(false);

const submitChat = async (chat, type) => {
  const humanId = uuidv4();
  const assistantId = uuidv4();
  chats.value.push({
    id: humanId,
    type,
    text: chat,
    isWebSearch: false,
    urls: [],
  });
  loading.value = true;
  try {
    const streamEvent = await getChatStreamEvent(chat, threadId.value);
    const decoder = new TextDecoder();
    chats.value.push({
      id: assistantId,
      type: "assistant",
      text: "",
      isWebSearch: false,
      urls: [],
    });

    for await (const chunk of streamEvent.body) {
      const text = decoder.decode(chunk, { stream: true });
      const updatedChat = chats.value.find((c) => c.id === assistantId);
      if (text.indexOf("event: error") === 0) {
        const updatedChat = chats.value.find((c) => c.id === assistantId);
        if (updatedChat) {
          updatedChat.text += "Error fetching response";
        }
        loading.value = false;
        return;
      }
      if (text.indexOf("event: thread_id") === 0) {
        if (!threadId.value) {
          threadId.value = text.split("data: ")[1].trim();
          router.push(`/chat/${threadId.value}`);
        }
        continue;
      }
      if (text.indexOf("event: web_search") === 0) {
        const searchResult = text.split("data: ")[1].trim();
        const resultJson = JSON.parse(searchResult);
        const urls = (resultJson?.results || []).map((result) => result.url);
        if (updatedChat) {
          updatedChat.isWebSearch = true;
          updatedChat.urls = urls;
        }
        continue;
      }
      if (text.trim()) {
        loading.value = false;
      }
      if (updatedChat) {
        updatedChat.text += text;
      }
    }
  } catch (error) {
    loading.value = false;
    const updatedChat = chats.value.find((c) => c.id === assistantId);
    if (updatedChat) {
      updatedChat.text += "Error fetching response";
    }
  } finally {
    loading.value = false;
  }
};

const handleNewChat = () => {
  router.push(`/chat`);
  threadId.value = "";
  chats.value = [];
};
</script>

<template>
  <Header @new-chat="handleNewChat" :chatHistory></Header>
  <div class="chat-wrapper">
    <div v-if="chats.length == 0" class="welcome-wrapper">
      <Welcome />
      <ChatInput
        :chats="chats"
        :loading="loading"
        @submit-chat="submitChat($event, 'user')"
      />
      <InitialSuggestion />
    </div>
    <ChatContainer v-if="chats.length > 0" :chats="chats" :loading="loading" />
    <ChatInput
      v-if="chats.length > 0"
      :chats="chats"
      :loading="loading"
      @submit-chat="submitChat($event, 'user')"
    />
    <Footer></Footer>
  </div>
</template>

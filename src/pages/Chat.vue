<script setup>
import Header from "../components/Header.vue";
import Welcome from "@/components/Welcome.vue";
import ChatInput from "@/components/ChatInput.vue";
import ChatContainer from "@/components/ChatContainer.vue";
import Footer from "@/components/Footer.vue";
import "../styles/chat.css";
import { ref, onMounted, watch } from "vue";
import {
  getChatHistoryForUser,
  getChatStreamEvent,
  getMessagesForThreadId,
} from "@/api/chat";
import { v4 as uuidv4 } from "uuid";
import { useRouter, useRoute } from "vue-router";
import { useUser } from "@clerk/vue";

const router = useRouter();
const route = useRoute();
const chats = ref([]);
const threadId = ref("");
const user = ref({});
const { user: clerkUser, isLoaded } = useUser();

const chatHistory = ref([]);

onMounted(() => {
  if (route.params.threadId) {
    threadId.value = route.params.threadId;
    handleHistorySelect(threadId.value);
  }
});

watch(
  () => isLoaded.value,
  () => {
    if (clerkUser.value) {
      user.value = {
        id: clerkUser.value.id,
        name: clerkUser.value.fullName,
        email: clerkUser.value.emailAddresses[0]?.emailAddress || "",
      };
    }
  }
);

watch(
  () => user.value,
  async () => {
    if (user.value.id) {
      chatHistory.value = await getChatHistoryForUser(user.value.id);
    }
  }
);

const loading = ref(false);

const submitChat = async (chat, type) => {
  const humanId = uuidv4();
  const assistantId = uuidv4();
  chats.value.push({
    id: humanId,
    type,
    text: chat,
    feedback: "",
    isWebSearch: false,
    urls: [],
  });
  loading.value = true;
  try {
    const streamEvent = await getChatStreamEvent({
      message: chat,
      threadId: threadId.value,
      user: user.value,
      humanId,
      assistantId,
    });
    chats.value.push({
      id: assistantId,
      type: "assistant",
      text: "",
      isWebSearch: false,
      urls: [],
    });

    const reader = streamEvent.body.getReader();
    const decoder = new TextDecoder();
    let done, value;

    while (true) {
      ({ done, value } = await reader.read());
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const updatedChat = chats.value.find((c) => c.id === assistantId);

      if (text.indexOf("event: error") === 0) {
        if (updatedChat) updatedChat.text += "Error fetching response";
        return;
      }
      if (text.indexOf("event: thread_id") === 0) {
        if (!threadId.value) {
          threadId.value = text.split("data: ")[1].trim();
          router.push(`/chat/${threadId.value}`);
        }
        continue;
      }
      if (text.indexOf("event: thread_title") === 0) {
        const title = text.split("data: ")[1].trim();
        chatHistory.value = [
          { threadId: threadId.value, title },
          ...chatHistory.value,
        ];
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
      if (updatedChat) {
        updatedChat.text += text;
      }
    }
  } catch (error) {
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

const handleHistorySelect = async (threadId) => {
  const messages = await getMessagesForThreadId(threadId);
  chats.value = messages;
  router.push(`/chat/${threadId}`);
};

const updateChatsForFeedback = (messageId, feedback) => {
  chats.value = chats.value.map((chat) => {
    if (chat.id === messageId) {
      return { ...chat, feedback };
    }
    return chat;
  });
};
</script>

<template>
  <Header
    @new-chat="handleNewChat"
    @select-history="handleHistorySelect($event)"
    :chatHistory
  ></Header>
  <div class="chat-wrapper">
    <div v-if="chats.length == 0" class="welcome-wrapper">
      <Welcome />
      <ChatInput
        :chats="chats"
        :loading="loading"
        @submit-chat="submitChat($event, 'user')"
      />
    </div>
    <ChatContainer
      v-if="chats.length > 0"
      :chats="chats"
      :loading="loading"
      :updateChatsForFeedback="updateChatsForFeedback"
    />
    <ChatInput
      v-if="chats.length > 0"
      :chats="chats"
      :loading="loading"
      @submit-chat="submitChat($event, 'user')"
    />
    <Footer></Footer>
  </div>
</template>

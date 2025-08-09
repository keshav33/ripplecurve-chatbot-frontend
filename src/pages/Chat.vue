<script setup>
import Header from "../components/Header.vue";
import Welcome from "@/components/Welcome.vue";
import ChatInput from "@/components/ChatInput.vue";
import ChatContainer from "@/components/ChatContainer.vue";
import Footer from "@/components/Footer.vue";
import "../styles/chat.css";
import { ref, onMounted, watch } from "vue";
import {
  deleteThread,
  getChatHistoryForUser,
  getChatStreamEvent,
  getMessagesForThreadId,
  uploadFile,
} from "@/api/chat";
import { v4 as uuidv4 } from "uuid";
import { useRouter, useRoute } from "vue-router";
import { useUser } from "@clerk/vue";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const route = useRoute();
const chats = ref([]);
const threadId = ref("");
const user = ref({});
const uploadedFile = ref({});
const { user: clerkUser, isLoaded } = useUser();
const toast = useToast();

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
      try {
        chatHistory.value = await getChatHistoryForUser(user.value.id);
      } catch (err) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Error fetching chat conversations",
          life: 3000,
        });
      }
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
      file: uploadedFile.value,
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

    const index = chats.value.findIndex((c) => c.id === assistantId);

    while (true) {
      ({ done, value } = await reader.read());
      if (done) break;

      const text = decoder.decode(value, { stream: true });

      if (text.indexOf("event: error") === 0) {
        if (index !== -1) {
          chats.value[index] = {
            ...chats.value[index],
            text: "Error fetching response",
          };
        }
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
        if (index !== -1) {
          chats.value[index] = {
            ...chats.value[index],
            isWebSearch: true,
            urls,
          };
        }
        continue;
      }

      if (index !== -1) {
        chats.value[index] = {
          ...chats.value[index],
          text: chats.value[index].text + text,
        };
      }
    }
    if (!chats.value[index].text) {
      chats.value[index] = {
        ...chats.value[index],
        text: "Something went wrong",
      };
    }
  } catch (error) {
    const index = chats.value.findIndex((c) => c.id === assistantId);
    if (index !== -1) {
      chats.value[index] = {
        ...chats.value[index],
        text: "Error fetching response",
      };
    }
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error fetching response",
      life: 3000,
    });
  } finally {
    loading.value = false;
    uploadedFile.value = {};
  }
};

const handleNewChat = () => {
  router.push(`/chat`);
  threadId.value = "";
  chats.value = [];
};

const handleHistorySelect = async (threadId) => {
  try {
    const messages = await getMessagesForThreadId(threadId);
    chats.value = messages;
    router.push(`/chat/${threadId}`);
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error fetching messages",
      life: 3000,
    });
  }
};

const updateChatsForFeedback = (messageId, feedback) => {
  chats.value = chats.value.map((chat) => {
    if (chat.id === messageId) {
      return { ...chat, feedback };
    }
    return chat;
  });
};

const handleUploadFile = async (file) => {
  try {
    const { fileId, fileType } = await uploadFile(file);
    uploadedFile.value = {
      fileId,
      fileType,
    };
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "File upoaded",
      life: 3000,
    });
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error while uploading file",
      life: 3000,
    });
  }
};

const handleDeleteThread = async (sidebarThreadId) => {
  await deleteThread(sidebarThreadId);
  if (sidebarThreadId === threadId) {
    handleNewChat();
  }
  chatHistory.value = chatHistory.value.filter(
    (history) => history.threadId !== sidebarThreadId
  );
};
</script>

<template>
  <Header
    @new-chat="handleNewChat"
    @select-history="handleHistorySelect($event)"
    @delete-thread="handleDeleteThread($event)"
    :chatHistory
  ></Header>
  <div class="chat-wrapper">
    <div v-if="chats.length == 0" class="welcome-wrapper">
      <Welcome />
      <ChatInput
        :chats="chats"
        :loading="loading"
        @submit-chat="submitChat($event, 'user')"
        @upload-file="handleUploadFile($event)"
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
      @upload-file="handleUploadFile($event)"
    />
    <Footer></Footer>
  </div>
</template>

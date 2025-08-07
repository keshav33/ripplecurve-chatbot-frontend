<script setup>
import "../styles/header.css";
import { ref } from "vue";
import Popover from "primevue/popover";
import Drawer from "primevue/drawer";

const { chatHistory } = defineProps({
  chatHistory: {
    type: Array,
    default: [],
  },
});

const isSidebarOpen = ref(false);
const showSettings = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
const toggleSettings = (event) => {
  showSettings.value.toggle(event);
};
</script>

<template>
  <div class="header">
    <div>
      <!-- Hamburger menu -->
      <i v-if="!isSidebarOpen" @click="toggleSidebar" class="pi pi-bars"></i>
    </div>
    <div>
      <i
        style="margin-right: 18px"
        @click="$emit('new-chat')"
        class="pi pi-comment"
      ></i>
      <i @click="toggleSettings" class="pi pi-cog"></i>
    </div>
    <Popover ref="showSettings">
      <div class="settings">TODO: Add some settings</div>
    </Popover>
    <Drawer
      v-model:visible="isSidebarOpen"
      class="sidebar"
      header="Ripplecurve"
    >
      <div class="sidebar-container">
        <div class="chat-history-container">
          <div style="font-size: large; font-weight: bold">
            Conversation History
          </div>
          <div v-for="history in chatHistory" class="history-item">
            {{ history.title }}
          </div>
        </div>
        <div><i class="pi pi-user" style="margin-right: 8px"></i>Keshav</div>
      </div>
    </Drawer>
  </div>
</template>

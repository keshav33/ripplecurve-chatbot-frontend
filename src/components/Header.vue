<script setup>
import "../styles/header.css";
import { ref } from "vue";
import Drawer from "primevue/drawer";
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import { UserButton, useUser } from "@clerk/vue";
const { chatHistory } = defineProps({
  chatHistory: {
    type: Array,
    default: [],
  },
});

const isSidebarOpen = ref(false);

const { user } = useUser();

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
  <div class="header">
    <div>
      <!-- Hamburger menu -->
      <i v-if="!isSidebarOpen" @click="toggleSidebar" class="pi pi-bars"></i>
    </div>
    <div class="header-actions">
      <i @click="$emit('new-chat')" class="pi pi-comment"></i>
      <UserButton />
    </div>
    <Drawer
      v-model:visible="isSidebarOpen"
      class="sidebar"
      header="Ripplecurve"
    >
      <div class="sidebar-container">
        <div class="chat-history-container">
          <Accordion>
            <AccordionPanel>
              <AccordionHeader style="font-size: large; font-weight: bold"
                >Conversation History</AccordionHeader
              >
              <AccordionContent>
                <div
                  v-for="history in chatHistory"
                  class="history-item"
                  @click="$emit('select-history', history.threadId)"
                >
                  {{ history.title }}
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
        <div class="user-settings">
          <span style="display: flex; align-items: center; gap: 8px"
            ><UserButton />{{ user.fullName }}</span
          >
        </div>
      </div>
    </Drawer>
  </div>
</template>

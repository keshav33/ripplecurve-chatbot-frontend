<script setup>
import "../styles/initialSuggestion.css";
const { setInputText } = defineProps({
  setInputText: {
    type: Function,
  },
});
const initialSuggestion = [
  "Summarise the uploaded document by using file upload",
  "I would like to search and summarise about",
  "Get the latest updates about what's happening around",
];
</script>

<template>
  <div class="suggestion-container">
    <div
      v-for="suggestion in initialSuggestion"
      class="suggestion-card"
      @click="setInputText(suggestion)"
    >
      <div>{{ suggestion }}</div>
    </div>
  </div>
</template>

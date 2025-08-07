<script setup>
import "../styles/initialSuggestion.css";

const initialSuggestion = [
  "Summarise the uploaded document by using file upload",
  "Ask me any question or anything you would like to search",
  "Get the latest updates about what's happening around",
];
</script>

<template>
  <div class="suggestion-container">
    <div v-for="suggestion in initialSuggestion" class="suggestion-card">
      <div>{{ suggestion }}</div>
    </div>
  </div>
</template>

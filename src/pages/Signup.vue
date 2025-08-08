<script setup lang="ts">
import { SignUp } from "@clerk/vue";
import "../styles/login.css";
</script>

<template>
  <div class="login-container">
    <SignUp :signInUrl="'/login'" />
  </div>
</template>

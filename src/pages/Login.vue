<script setup lang="ts">
import { SignIn } from "@clerk/vue";
import "../styles/login.css";
</script>

<template>
  <div class="login-container">
    <SignIn :redirectUrl="'/chat'" :signUpUrl="'/sign-up'" />
  </div>
</template>

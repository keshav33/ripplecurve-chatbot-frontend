<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  router.push("/chat")
})
</script>

<template>
  <router-view />
</template>
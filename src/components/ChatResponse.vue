<script setup>
    const { chat } = defineProps({
        chat: {
            type: Object
        }
    });

    const chatClass = {
        'user-message': chat.type === 'user', 
        'assistant-message': chat.type === 'assistant'
    }
</script>

<template>
    <div :class="chatClass">
        <div>
            {{ chat.text }}
        </div>
        <div v-if="chat.type === 'assistant'" style="margin-top: 12px;">
            <i style="margin-right: 12px;" class="pi pi-copy"></i>
            <i style="margin-right: 12px;" class="pi pi-thumbs-up"></i>
            <i class="pi pi-thumbs-down"></i>
        </div>
    </div>
</template>
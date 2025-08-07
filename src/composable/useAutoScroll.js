import { onMounted, onUpdated, ref } from 'vue';

/**
 * useAutoScroll composable
 * Automatically scrolls to the bottom of a container when chats change.
 * @returns {Object} { chatContainerRef }
 */
export function useAutoScroll() {
    const chatContainerRef = ref(null);

    const scrollToBottom = () => {
        if (chatContainerRef.value) {
            chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
        }
    };

    onMounted(scrollToBottom);
    onUpdated(scrollToBottom);

    return { chatContainerRef };
}

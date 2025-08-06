<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import Popover from 'primevue/popover';
import "../styles/chatInput.css"

const emit = defineEmits(["submit-chat"])
const props = defineProps({
  chats: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const inputText = ref("");
const isFocused = ref(false);
const isRecording = ref(false);
const recognition = ref(null);
const additionalActions = ref(false);

const toggleAdditionalActions = (event) => {
    additionalActions.value.toggle(event);
}

// Initialize speech recognition on component mount
onMounted(() => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.value = new SpeechRecognition();
    
    // Configure recognition settings
    recognition.value.continuous = true;
    recognition.value.interimResults = true;
    recognition.value.lang = 'en-US';
    
    // Handle speech recognition results
    recognition.value.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Update input text with final transcript
      if (finalTranscript) {
        inputText.value += finalTranscript;
      }
    };
    
    // Handle recognition end
    recognition.value.onend = () => {
      isRecording.value = false;
    };
    
    // Handle recognition errors
    recognition.value.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      isRecording.value = false;
    };
    
    // Auto-stop when user stops speaking (using speech end detection)
    recognition.value.onspeechend = () => {
      setTimeout(() => {
        if (isRecording.value) {
          stopRecording();
        }
      }, 1000); // Stop 1 second after speech ends
    };
  }
});

// Cleanup on component unmount
onUnmounted(() => {
  if (recognition.value && isRecording.value) {
    recognition.value.stop();
  }
});

const submitChat = () => {
    emit("submit-chat", inputText.value)
    inputText.value = "";
}

const startRecording = () => {
  if (recognition.value && !isRecording.value) {
    try {
      recognition.value.start();
      isRecording.value = true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  }
};

const stopRecording = () => {
  if (recognition.value && isRecording.value) {
    recognition.value.stop();
    isRecording.value = false;
  }
};

const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
};

const textInputClass = computed(() => ({
    "input-container": true,
    "pan-bottom": props.chats.length > 0,
    "focused": isFocused.value
}));

const handleEnter = (event) => {
    if (props.loading) return;
    if (inputText.value.trim().length === 0 ) return;
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        submitChat();
    }
}

const handleFocus = () => {
    isFocused.value = true;
}

const handleBlur = () => {
    isFocused.value = false;
}
</script>

<template>
    <div :class="textInputClass">
        <textarea 
            placeholder="What do you have in mind?"
            v-model="inputText" 
            @keydown="handleEnter"
            @focus="handleFocus"
            @blur="handleBlur"
        ></textarea>
        <div class="input-action-container">
            <i @click="toggleAdditionalActions" class="pi pi-plus"></i>
            <Popover ref="additionalActions">
                <div class="additional-actions">
                    <label style="display: flex; align-items: center; cursor: pointer; padding: 8px; border-radius: 4px;">
                        <i class="pi pi-upload" style="margin-right: 8px;"></i>
                        <span>Upload File</span>
                        <input 
                            type="file" 
                            style="display: none;"
                        />
                    </label>
                </div>
            </Popover>
            <div>
                <i 
                    class="pi pi-microphone" 
                    :class="{ 'recording': isRecording }" 
                    @click="toggleRecording"
                    :title="isRecording ? 'Stop recording' : 'Start voice input'"
                ></i>
                <i v-if="inputText.trim().length > 0 && !props.loading" @click="submitChat" class="pi pi-send" style="margin-left: 6px;"></i>
                <i v-if="props.loading" style="margin-left: 6px;" class="pi pi-spin pi-spinner"></i>
            </div>
        </div>
    </div>
</template>
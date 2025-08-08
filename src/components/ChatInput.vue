<script setup>
import { ref, computed, watch } from "vue";
import Popover from "primevue/popover";
import useTranscribe from "@/composable/useTranscribe";
import "../styles/chatInput.css";
import InitialSuggestion from "./InitialSuggestion.vue";

const emit = defineEmits(["submit-chat"]);
const props = defineProps({
  inputText: {
    type: String,
    default: "",
  },
  chats: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const { isRecording, toggleRecording, transcribedText } = useTranscribe();
// Watch for transcribed text and update inputText
watch(
  () => transcribedText.value,
  (newVal) => {
    if (newVal && newVal.trim().length > 0) {
      inputText.value = newVal;
    }
  }
);

const inputText = ref("");
const isFocused = ref(false);
const additionalActions = ref(false);

const toggleAdditionalActions = (event) => {
  additionalActions.value.toggle(event);
};

const submitChat = () => {
  emit("submit-chat", inputText.value);
  inputText.value = "";
};

const textInputClass = computed(() => ({
  "input-container": true,
  "pan-bottom": props.chats.length > 0,
  focused: isFocused.value,
}));

const handleEnter = (event) => {
  if (props.loading) return;
  if (inputText.value.trim().length === 0) return;
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    submitChat();
  }
};

const handleFocus = () => {
  isFocused.value = true;
};

const handleBlur = () => {
  isFocused.value = false;
};

const setInputText = (text) => {
  inputText.value = text;
};

const microphoneClass = computed(() => ({
  "pi pi-microphone": true,
  recording: isRecording.value,
}));
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
          <!-- <label
            style="
              display: flex;
              align-items: center;
              cursor: pointer;
              padding: 8px;
              border-radius: 4px;
            "
          >
            <i class="pi pi-upload" style="margin-right: 8px"></i>
            <span>Upload File</span>
            <input type="file" style="display: none" />
          </label> -->
          Coming Soon
        </div>
      </Popover>
      <div>
        <i
          :class="microphoneClass"
          @click="toggleRecording"
          :title="isRecording ? 'Stop recording' : 'Start voice input'"
        ></i>
        <i
          v-if="inputText.trim().length > 0 && !props.loading"
          @click="submitChat"
          class="pi pi-send"
          style="margin-left: 6px"
        ></i>
        <i
          v-if="props.loading"
          style="margin-left: 6px"
          class="pi pi-spin pi-spinner"
        ></i>
      </div>
    </div>
  </div>
  <div v-if="chats.length === 0">
    <InitialSuggestion :setInputText="setInputText" />
  </div>
</template>

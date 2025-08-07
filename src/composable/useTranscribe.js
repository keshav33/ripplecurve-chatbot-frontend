import { ref, onMounted, onUnmounted } from 'vue';

const useTranscribe = () => {
    const isRecording = ref(false);
    const recognition = ref(null);

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

    onUnmounted(() => {
        if (recognition.value && isRecording.value) {
            recognition.value.stop();
        }
    });

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


    return {
        isRecording,
        recognition,
        startRecording,
        stopRecording,
        toggleRecording
    }
}

export default useTranscribe;
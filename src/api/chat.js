const BASE_URL = 'http://localhost:3000';

export const getChatStreamEvent = async (message, threadId) => {
    return fetch(`${BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, threadId })
    });
}
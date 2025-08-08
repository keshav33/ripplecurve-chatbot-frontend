import axios from "axios";

const BASE_URL = import.meta.env.VITE_RIPPLECURVE_BACKEND

const getClerkToken = async () => {
    const clerk = window.Clerk;
    const token = await clerk.session.getToken();
    return token
}

export const getChatStreamEvent = async ({ message, threadId, user, humanId, assistantId }) => {
    return fetch(`${BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await getClerkToken()}`
        },
        body: JSON.stringify({
            message, threadId, user, humanId, assistantId
        })
    });
}

export const getChatHistoryForUser = async (userId) => {

    return axios.get(`${BASE_URL}/chat/history?userId=${userId}`, {
        headers: {
            Authorization: `Bearer ${await getClerkToken()}`,
        }
    })
        .then(res => res.data)
}

export const getMessagesForThreadId = async (threadId) => {
    return axios.get(`${BASE_URL}/chat/messages?threadId=${threadId}`, {
        headers: {
            Authorization: `Bearer ${await getClerkToken()}`,
        }
    })
        .then(res => res.data)
}

export const updateFeedback = async ({ threadId, messageId, feedback }) => {
    return axios.put(`${BASE_URL}/chat/feedback?threadId=${threadId}&messageId=${messageId}&feedback=${feedback}`, {}, {
        headers: {
            Authorization: `Bearer ${await getClerkToken()}`,
        }
    })
}
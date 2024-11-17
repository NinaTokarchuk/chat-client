import { CREATE_CHAT, CREATE_GROUP, DELETE_CHAT_SUCCESS, GET_USERS_CHAT } from "./ActionType"

const initialValue = {
    chats: [],
    createdGroup: null,
    createdChat: null
}
export const chatReducer = (store = initialValue, { type, payload }) => {
    if (type === CREATE_CHAT) {
        return { ...store, createdChat: payload }
    }
    else if (type === CREATE_GROUP) {
        return { ...store, createdGroup: payload }
    }
    else if (type === GET_USERS_CHAT) {
        return { ...store, chats: payload }
    }
    else if (type === DELETE_CHAT_SUCCESS) {
        return { ...store, chats: store.chats.filter(chat => chat.id !== payload) }
    }
    return store;
}
import { BASE_API_URL } from "../../config/api"
import { CREATE_CHAT, CREATE_GROUP, DELETE_CHAT_SUCCESS, GET_USERS_CHAT } from "./ActionType";

export const createChat = (chatData) => async (dispatch) => {
    try {
        console.log("START TO CREATE CHAT, token = ", chatData.token);
        console.log("DATA = ", chatData.data);
        const res = await fetch(`${BASE_API_URL}/api/chats/single`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${chatData.token}`
            },
            body: JSON.stringify(chatData.data)
        })
        const data = await res.json();
        console.log("create chat ", data);
        dispatch({ type: CREATE_CHAT, payload: data })
    } catch (error) {
        console.log("catch error ", error)
    }
}


export const deleteChat = (chatData) => async (dispatch) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/chats/delete/${chatData.chatId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${chatData.token}`
            }
        });

        const data = await response.json();
        if (response.ok) {
            console.log("chat deleted ", chatData.chatId);
            dispatch({ type: DELETE_CHAT_SUCCESS, payload: chatData.chatId })
        } else {
            console.log("response unsuccessful ")
        }
    } catch (error) {
        console.log("catch error ", error)
    }
};

export const createGroupChat = (chatData) => async (dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/api/chats/group`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${chatData.token}`
                },
                body: JSON.stringify(chatData.group)
            })
        const data = await res.json();
        console.log("create group ", data);
        dispatch({ type: CREATE_GROUP, payload: data })
    } catch (error) {
        console.log("catch error ", error)
    }
}

export const getUsersChat = (chatData) => async (dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/api/chats/user`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${chatData.token}`
                }
            })
        const data = await res.json();
        console.log("get users chat ", data);
        dispatch({ type: GET_USERS_CHAT, payload: data })
    } catch (error) {
        console.log("catch error ", error)
    }
}
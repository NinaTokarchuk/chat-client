import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE } from "./ActionType";
import { BASE_API_URL } from "../../config/api"

export const createMessage = (messageData) => async (dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/api/messages/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${messageData.token}`
                },
                body: JSON.stringify(messageData.data)
            })
        const data = await res.json();
        console.log("create message ", data);
        dispatch({ type: CREATE_NEW_MESSAGE, payload: data })
    } catch (error) {
        console.log("catch error ", error)
    }
}

export const getAllMessages = (data, token) => async (dispatch) => {
    try {
        console.log("TOKEN!! ", token)
        console.log("DATA!! ", data)
        console.log("chat id!! ", data.chatId)
        console.log("URL :", `${BASE_API_URL}/api/messages/chats/${data}`)
        const res = await fetch(`${BASE_API_URL}/api/messages/chats/${data}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
        const resData = await res.json();
        console.log("get messages ", resData);
        dispatch({ type: GET_ALL_MESSAGE, payload: resData })
    } catch (error) {
        console.log("catch error ", error)
    }
}
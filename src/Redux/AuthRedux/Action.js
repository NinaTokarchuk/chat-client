import { BASE_API_URL } from "../../config/api"
import { LOGIN, LOGOUT, REGISTER, REQ_USER, SEARCH_USER, UPDATE_USER, LOGIN_FAILED, CLEAR_LOGIN_ERROR } from "./ActionType";

export const register = (data) => async (dispatch) => {
    try {
        console.log("Base API URL:", BASE_API_URL);
        const res = await fetch(`${BASE_API_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"

            },
            body: JSON.stringify(data)
        })
        const resData = await res.json();
        if (resData.jwt) localStorage.setItem("token", resData.jwt)
        console.log("register ", resData);
        dispatch({ type: REGISTER, payload: resData })
    } catch (error) {
        console.log("catch error: ", error)
    }
}
export const login = (data) => async (dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const resData = await res.json();
        console.log("login ", resData);
        if (res.status === 200 && resData.jwt) {
            localStorage.setItem("token", resData.jwt);
            dispatch({ type: LOGIN, payload: resData });
        } else {
            dispatch({ type: LOGIN_FAILED, payload: resData.message || 'User not found' });
        }
    } catch (error) {
        console.log("catch error: ", error);
        dispatch({ type: LOGIN_FAILED, payload: 'Login failed due to network error' });
    }
}

export const clearLoginError = () => {
    return { type: CLEAR_LOGIN_ERROR };
}

export const currentUser = (token) => async (dispatch) => {
    console.log("current user ", token)
    try {
        const res = await fetch(`${BASE_API_URL}/api/users/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        const resData = await res.json();
        console.log("currentUser ", resData);
        dispatch({ type: REQ_USER, payload: resData })
    } catch (error) {
        console.log("catch error: ", error)
    }
}

export const searchUser = (data, token) => async (dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/api/users?query=${data.keyword}`, {

            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        })
        const resData = await res.json();
        console.log("searchUser ", resData);
        dispatch({ type: SEARCH_USER, payload: resData })
    } catch (error) {
        console.log("catch error: ", error)
    }
}

export const updateUser = (data) => async (dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/api/users/update/${data.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`
            },
            body: JSON.stringify(data.data)
        })
        const resData = await res.json();
        console.log("updateUser ", resData);
        dispatch({ type: UPDATE_USER, payload: resData })
    } catch (error) {
        console.log("catch error: ", error)
    }
}

export const logout = () => async (dispatch) => {
    localStorage.removeItem("token");
    dispatch({ type: LOGOUT, payload: null });
    dispatch({ type: REQ_USER, payload: null });
}

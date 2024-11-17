import { LOGIN, REGISTER, REQ_USER, SEARCH_USER, UPDATE_USER, LOGIN_FAILED, CLEAR_LOGIN_ERROR } from "./ActionType"

const initialValue = {
    signup: null,
    signin: null,
    reqUser: null,
    searchUser: [],
    loginError: null
}

export const authReducer = (store = initialValue, { type, payload }) => {
    if (type === REGISTER) {
        return { ...store, signup: payload }
    }
    else if (type === LOGIN) {
        return { ...store, signin: payload }
    }
    else if (type === REQ_USER) {
        return { ...store, reqUser: payload }
    }
    else if (type === SEARCH_USER) {
        return { ...store, searchUser: payload }
    }
    else if (type === UPDATE_USER) {
        return { ...store, updatedUser: payload }
    }
    else if (type === LOGIN_FAILED) {
        return { ...store, loginError: payload };
    }
    else if (type === CLEAR_LOGIN_ERROR) { return { ...store, loginError: null }; }

    return store;
}
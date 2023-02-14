import {
    SET_ASKED_QUESTION,
    SET_MARK,
    SET_CORRECT,
    SET_MODE,
    SET_IS_LOG_IN,
    SET_USERNAME,
    SET_COUNT,
    SET_SCHOOL_NAME,
    SET_CLIENT_NAME,
    SET_PROVINCE,
    SET_ANSWERED,
} from './constants';

export const setAskedQuestion = (payload) => ({
    type: SET_ASKED_QUESTION,
    payload,
});

export const setMark = (payload) => ({
    type: SET_MARK,
    payload,
});

export const setCorrect = (payload) => ({
    type: SET_CORRECT,
    payload,
});

export const setMode = (payload) => ({
    type: SET_MODE,
    payload,
});

export const setIsLogIn = (payload) => ({
    type: SET_IS_LOG_IN,
    payload,
});

export const setUsername = (payload) => ({
    type: SET_USERNAME,
    payload,
});

export const setCount = (payload) => ({
    type: SET_COUNT,
    payload,
});

export const setClientName = (payload) => ({
    type: SET_CLIENT_NAME,
    payload,
});

export const setSchoolName = (payload) => ({
    type: SET_SCHOOL_NAME,
    payload,
});

export const setProvince = (payload) => ({
    type: SET_PROVINCE,
    payload,
});

export const setAnswered = (payload) => ({
    type: SET_ANSWERED,
    payload,
});

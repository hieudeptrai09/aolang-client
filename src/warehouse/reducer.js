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

const initState = {
    askedQuestion: [],
    mark: 0,
    correct: [],
    mode: '',
    isLogIn: false,
    username: '',
    count: 0,
    schoolName: '',
    clientName: '',
    province: '',
    playersAnswered: [],
};

function reducer(state, action) {
    switch (action.type) {
        case SET_ASKED_QUESTION:
            return {
                ...state,
                askedQuestion: action.payload,
            };
        case SET_MARK:
            return {
                ...state,
                mark: action.payload,
            };
        case SET_CORRECT:
            return {
                ...state,
                correct: action.payload,
            };
        case SET_MODE:
            return {
                ...state,
                mode: action.payload,
            };
        case SET_IS_LOG_IN:
            return {
                ...state,
                isLogIn: action.payload,
            };
        case SET_USERNAME:
            return {
                ...state,
                username: action.payload,
            };
        case SET_COUNT:
            return {
                ...state,
                count: action.payload,
            };
        case SET_SCHOOL_NAME:
            return {
                ...state,
                schoolName: action.payload,
            };
        case SET_CLIENT_NAME:
            return {
                ...state,
                clientName: action.payload,
            };
        case SET_PROVINCE:
            return {
                ...state,
                province: action.payload,
            };
        case SET_ANSWERED:
            return {
                ...state,
                playersAnswered: action.payload,
            };
        default:
            throw new Error('Invalid action.');
    }
}

export { initState };
export default reducer;

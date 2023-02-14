import axios from 'axios';
import { HOST_URL } from './hostURL';

const request = axios.create({
    baseURL: HOST_URL + '/generalAPI',
});

export const get = async (path, payload = {}) => {
    const response = await request.get(path, payload);
    return response.data;
};

export const post = async (path, payload) => {
    const response = await request.post(path, payload);
    return response.data;
};

export default request;

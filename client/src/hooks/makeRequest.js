import axios from 'axios';

export const makeRequest = axios.create({
    baseURL: import.meta.env.API_URL
})
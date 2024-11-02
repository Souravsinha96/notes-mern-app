import axios from 'axios';

const BASE_URL = 'https://notes-mern-app-ofsy.onrender.com';

export const customAxios = axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

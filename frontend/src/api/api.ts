import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',      
});

// Todo: Bago pa man dumating yung request sa server is i-check muna kung may token sa localStorage, kung meron, iseset yung Authorization header ng request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Todo: If walang token or expired yung token, i-remove yung token sa localStorage at i-redirect yung user sa login page, Kapag ang request ay Success (200 OK), wala siyang gagawin, ipapasa lang niya yung data
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
)

export default api;
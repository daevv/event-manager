// axiosInstance.ts
import axios from 'axios';

// Создаём экземпляр axios с базовыми настройками
const axiosInstance = axios.create({
  baseURL: 'http://localhost:2000/', // Устанавливаем базовый URL для всех запросов
  headers: {
    'Content-Type': 'application/json' // Устанавливаем стандартный Content-Type для JSON
  }
});

// Добавляем интерсептор для авторизации
axiosInstance.interceptors.request.use(
  (config) => {
    // Добавляем токен авторизации, если он есть
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Обрабатываем ошибки запроса
    return Promise.reject(error);
  }
);

export default axiosInstance;

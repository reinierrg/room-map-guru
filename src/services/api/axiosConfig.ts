import axios from 'axios';

// Configuración base de Axios
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.roommapguru.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
    response => response,
    error => {
        const apiError = {
            message: error.response?.data?.message || 'Error de conexión',
            status: error.response?.status || 0,
            data: error.response?.data
        };
        return Promise.reject(apiError);
    }
);

export default apiClient;
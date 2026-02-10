import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

/**
 * AccessToken을 메모리에 저장 (Security 강화)
 * - localStorage에 저장하지 않아 XSS 공격으로부터 보호됩니다.
 */
let accessToken: string | null = null;

/**
 * 외부(useAuth 등)에서 토큰을 주입하는 함수
 */
export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

const apiClient: AxiosInstance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // [중요] RefreshToken 쿠키 전송을 위해 필수
    timeout: 10000,
});

apiClient.interceptors.request.use(
    (config) => {
        // 메모리에 있는 토큰을 헤더에 주입
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error) => {
        // TODO: 401 발생 시 여기서도 재발급 로직을 넣을 수 있음 (지금은 앱 시작 시 체크로 커버)
        return Promise.reject(error);
    }
);

export default apiClient;
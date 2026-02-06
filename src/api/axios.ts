import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

/**
 * Axios Instance 설정
 * - 기본 URL 설정 (Vite Proxy 사용 시 상대 경로)
 * - 요청/응답 인터셉터 설정 (토큰 자동 주입, 에러 처리)
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: '/api', // Vite Proxy 설정에 맞춤
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10초 타임아웃
});

/**
 * [Request Interceptor]
 * - API 요청 전, 로컬 스토리지의 AccessToken을 헤더에 자동 주입합니다.
 */
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // 토큰이 존재하면 Authorization 헤더에 Bearer 토큰 추가
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * [Response Interceptor]
 * - 응답 에러 공통 처리 (401 Unauthorized 등)
 */
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // 401 에러 발생 시 (토큰 만료 등) 처리 로직
        // TODO: Refresh Token(쿠키)을 이용한 재발급 로직 추후 구현 필요
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.warn('[API] 토큰이 만료되었거나 유효하지 않습니다.');
            // 예: 로그인 페이지로 이동하거나, 토큰 재발급 API 호출
        }

        return Promise.reject(error);
    }
);

export default apiClient;

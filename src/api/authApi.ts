import api from './axios';

/**
 * Auth API Service
 * - 백엔드 AuthController와 매핑
 */
export const authApi = {
    
    /**
     * Access Token 갱신 요청
     * - Refresh Token은 쿠키(HttpOnly)에 담겨 자동으로 전송됨
     * @returns 새로운 accessToken
     */
    async refreshAccessToken() {
        // 응답: { accessToken: "..." }
        const { data } = await api.post<{ accessToken: string }>('/auth/refresh');
        return data.accessToken;
    }
};

import api from './axios';

export const authApi = {
    /**
     * AccessToken 재발급 (Silent Refresh)
     * - HttpOnly 쿠키에 저장된 RefreshToken을 사용하여 새로운 AccessToken을 받음
     * POST /api/auth/refresh
     */
    async refreshToken() {
        const { data } = await api.post<{ accessToken: string }>('/auth/refresh');
        return data.accessToken;
    }
};

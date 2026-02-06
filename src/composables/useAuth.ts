import {computed, ref} from 'vue';
import type {Member} from '../types/Member';
import {memberApi} from '../api/memberApi';

// 전역 인증 상태 (Singleton)
const isLoggedIn = ref(false);
const currentUser = ref<Member | null>(null);

/**
 * [Composable] 인증 및 사용자 세션 관리
 * - 로그인, 로그아웃, 내 정보 조회 등 인증 관련 비즈니스 로직을 담당합니다.
 */
export function useAuth() {

    /**
     * 로그인 프로세스 시작
     * - 백엔드의 구글 OAuth2 로그인 호출
     */
    const login = () => {
        window.location.href = '/oauth2/authorization/google';
    };

    /**
     * 로그인 성공 후처리
     * - 발급받은 토큰을 저장하고, 사용자 정보를 로드하여 상태를 갱신
     * 
     * @param accessToken 백엔드로부터 발급받은 JWT Access Token
     */
    const loginSuccess = async (accessToken: string) => {
        // 1. 토큰 저장
        localStorage.setItem('accessToken', accessToken);
        isLoggedIn.value = true;

        // 2. 내 정보 최신화 (DB 조회)
        try {
            await fetchMyProfile();
        } catch (e) {
            console.error('사용자 정보 로드 실패', e);
            logout();
        }
    };

    /**
     * 내 프로필 정보 조회 및 상태 갱신
     * - 온보딩 완료 후 상태 변경(PENDING -> ACTIVE)을 반영하기 위해 외부 노출
     */
    const fetchMyProfile = async () => {
        try {
            // 실제 API 호출 (GET /api/members/me)
            currentUser.value = await memberApi.getMyProfile();
        } catch (e) {
            throw e;
        }
    };

    /**
     * 로그아웃 처리
     * - 프론트엔드 저장소(변수, 로컬스토리지)를 초기화
     */
    const logout = () => {
        isLoggedIn.value = false;
        currentUser.value = null;
        localStorage.removeItem('accessToken');
        // TODO: 필요시 백엔드 로그아웃 API 호출 (Refresh Token 쿠키 삭제)
    };

    /**
     * 앱 초기화 시 로그인 상태 복구
     * - 새로고침 하더라도 로컬 스토리지에 토큰이 있다면 로그인 상태를 유지
     */
    const checkAuth = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            isLoggedIn.value = true;
            try {
                await fetchMyProfile();
            } catch (e) {
                logout();
            }
        }
    };

    return {
        // 읽기 전용으로 제공 (외부에서 임의 변경 방지)
        isLoggedIn: computed(() => isLoggedIn.value),
        currentUser: computed(() => currentUser.value),
        
        // Actions
        login,
        loginSuccess,
        logout,
        checkAuth,
        fetchMyProfile
    };
}

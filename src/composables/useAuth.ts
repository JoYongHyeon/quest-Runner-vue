import { ref, computed, type ComputedRef } from 'vue';
import type { Member } from '../types/Member';
import { memberApi } from '../api/memberApi';

// 반환 타입 명시 (TypeScript 에러 방지)
interface UseAuthReturn {
    isLoggedIn: ComputedRef<boolean>;
    currentUser: ComputedRef<Member | null>;
    login: () => void;
    loginSuccess: (token: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    fetchMyProfile: () => Promise<void>;
    requireOnboarding: () => boolean;
}

// 전역 인증 상태 (Singleton)
const isLoggedIn = ref(false);
const currentUser = ref<Member | null>(null);

/**
 * [Composable] 인증 및 사용자 세션 관리
 * - 로그인, 로그아웃, 내 정보 조회 등 인증 관련 비즈니스 로직을 담당합니다.
 */
export function useAuth(): UseAuthReturn {

    /**
     * 로그인 프로세스 시작
     */
    const login = () => {
        window.location.href = '/oauth2/authorization/google';
    };

    /**
     * 로그인 성공 후처리
     */
    const loginSuccess = async (accessToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        isLoggedIn.value = true;

        try {
            await fetchMyProfile();
        } catch (e) {
            console.error('사용자 정보 로드 실패', e);
            logout();
        }
    };

    /**
     * 내 프로필 정보 조회 및 상태 갱신
     */
    const fetchMyProfile = async () => {
        try {
            const member = await memberApi.getMyProfile();
            currentUser.value = member;
        } catch (e) {
            throw e;
        }
    };

    /**
     * 로그아웃 처리
     */
    const logout = () => {
        isLoggedIn.value = false;
        currentUser.value = null;
        localStorage.removeItem('accessToken');
    };

    /**
     * 앱 초기화 시 로그인 상태 복구
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

    /**
     * 온보딩 완료 여부 확인 (Guard)
     */
    const requireOnboarding = (): boolean => {
        if (!isLoggedIn.value) {
            alert('로그인이 필요한 기능입니다.');
            login();
            return false;
        }

        if (currentUser.value?.status === 'PENDING_PROFILE') {
            if (confirm('이 기능을 이용하려면 먼저 모험가 등록(프로필 완성)을 해야 합니다.이동하시겠습니까?')) {
                window.location.href = '/onboarding'; 
            }
            return false;
        }
        return true;
    };

    return {
        isLoggedIn: computed(() => isLoggedIn.value),
        currentUser: computed(() => currentUser.value),
        login,
        loginSuccess,
        logout,
        checkAuth,
        fetchMyProfile,
        requireOnboarding
    };
}

import {computed, type ComputedRef, ref} from 'vue';
import type {Member} from '../types/Member';
import {memberApi} from '../api/memberApi';
import {authApi} from '../api/authApi';
import {setAccessToken} from '../api/axios';

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

const isLoggedIn = ref(false);
const currentUser = ref<Member | null>(null);

export function useAuth(): UseAuthReturn {

    const login = () => {
        window.location.href = '/oauth2/authorization/google';
    };

    const loginSuccess = async (token: string) => {
        // [수정] localStorage 대신 메모리(axios)에 저장
        setAccessToken(token);
        isLoggedIn.value = true;
        try {
            await fetchMyProfile();
        } catch (e) {
            console.error('사용자 정보 로드 실패', e);
            logout();
        }
    };

    const fetchMyProfile = async () => {
        try {
            currentUser.value = await memberApi.getMyProfile();
        } catch (e) {
            throw e;
        }
    };

    const logout = () => {
        isLoggedIn.value = false;
        currentUser.value = null;
        setAccessToken(null); // 토큰 삭제
        // TODO: 백엔드 로그아웃 API가 있다면 호출하여 쿠키 삭제 필요
    };

    const checkAuth = async () => {
        // [수정] localStorage 확인 대신 Refresh API 호출 (Silent Refresh)
        try {
            const newToken = await authApi.refreshToken();
            await loginSuccess(newToken);
        } catch (e) {
            // Refresh 실패 = 로그인 안 된 상태 (조용히 실패)
            logout();
        }
    };

    const requireOnboarding = (): boolean => {
        if (!isLoggedIn.value) {
            alert('로그인이 필요한 기능입니다.');
            login();
            return false;
        }

        if (currentUser.value?.status === 'PENDING_PROFILE') {
            if (confirm('이 기능을 이용하려면 먼저 프로필을 완성해야 합니다.\n내 프로필 설정으로 이동하시겠습니까?')) {
                window.location.href = '/profile'; 
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

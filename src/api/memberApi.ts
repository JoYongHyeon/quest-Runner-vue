import api from './axios';
import type { Position } from '../types/Member'; // 올바른 경로로 수정

// --- DTO Types ---
export interface OnboardingReqDTO {
    nickname: string;
    position: Position;
    intro?: string;
    gitUrl?: string;
    blogUrl?: string;
    resumeLink?: string;
    techStacks: string[];
}

export interface MemberProfileResDTO {
    id: number;
    email: string;
    nickname: string;
    status: 'PENDING_PROFILE' | 'ACTIVE';
    position: Position;
    techStacks: string[];
    intro?: string;
    gitUrl?: string;
    blogUrl?: string;
    resumeLink?: string;
}

// [New] 닉네임 중복 확인 응답
export interface NicknameCheckResDTO {
    isAvailable: boolean;
}

/**
 * Member API Service
 * - 백엔드 MemberController와 매핑
 */
export const memberApi = {

    /**
     * 내 프로필 정보 조회
     * GET /api/members/me
     */
    async getMyProfile() {
        const { data } = await api.get<{ code: string; data: MemberProfileResDTO }>('/members/me');
        return data.data;
    },

    /**
     * 프로필 완성 요청
     * PATCH /api/members/profile
     */
    async completeMyProfile(req: OnboardingReqDTO) {
        const { data } = await api.patch<{ code: string }>('/members/profile', req);
        return data;
    },

    /**
     * 닉네임 중복 확인
     * GET /api/members/check-nickname?nickname=...
     */
    async checkNickname(nickname: string) {
        // ApiResponse 구조에 맞춰 data.data를 반환하도록 수정
        const { data } = await api.get<{ code: string; data: NicknameCheckResDTO }>(
            '/members/check-nickname',
            { params: { nickname } }
        );
        return data.data;
    }
};

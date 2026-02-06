import api from './axios';
import type {Position} from "postcss";
import type {Member, Region} from "../types/Member.ts";

// --- DTO Types ---
export interface OnboardingReqDTO {
    nickname: string;
    position: Position;
    region: Region;
    intro?: string;
    gitUrl?: string;
    blogUrl?: string;
    resumeLink?: string;
    techStacks: string[];
}

export interface MemberProfileResDTO extends Member {
    // Member 인터페이스와 동일하지만, 필요시 확장 가능
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
     * 온보딩(프로필 완성) 요청
     * PATCH /api/members/onboarding
     */
    async completeOnboarding(req: OnboardingReqDTO) {
        const { data } = await api.patch<{ code: string }>('/members/onboarding', req);
        return data;
    }
};

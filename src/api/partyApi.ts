import api from './axios';
import type {Region} from "../types/Member.ts";
import type {Position} from "postcss";
import type {ApplicantStatus, Party} from "../types/Party.ts";

// --- DTO Types ---
export interface PartySearchCondition {
    region?: Region;
    position?: Position;
    page?: number;
    size?: number;
}

export interface PartyCreateReqDTO {
    title: string;
    content: string;
    region: Region;
    slots: { position: Position }[]; // 단순화된 슬롯 요청
}

export interface PartyApplyReqDTO {
    slotId: number;
    message: string;
}

export interface ApplicantDecisionReqDTO {
    status: 'ACCEPTED' | 'REJECTED';
}

export interface PartyListResDTO {
    content: Party[];
    pageable: any;
    totalPages: number;
    totalElements: number;
    last: boolean;
}

export interface PartyDetailResDTO extends Party {
    // 파티 상세 정보 (추가 필드 있을 수 있음)
}

export interface PartyApplicantResDTO {
    applicantId: number;
    nickname: string;
    position: Position;
    message: string;
    status: ApplicantStatus;
    appliedAt: string;
}

/**
 * Party API Service
 * - 백엔드 PartyController와 매핑
 */
export const partyApi = {

    /**
     * 파티 목록 조회 (페이징, 검색)
     * GET /api/parties
     */
    async getPartyList(condition: PartySearchCondition) {
        const { data } = await api.get<{ code: string; data: PartyListResDTO }>('/parties', {
            params: condition
        });
        return data.data;
    },

    /**
     * 파티 상세 조회
     * GET /api/parties/{partyId}
     */
    async getPartyDetail(partyId: number) {
        const { data } = await api.get<{ code: string; data: PartyDetailResDTO }>(`/parties/${partyId}`);
        return data.data;
    },

    /**
     * 파티 생성
     * POST /api/parties
     */
    async createParty(req: PartyCreateReqDTO) {
        const { data } = await api.post<{ code: string; data: { partyId: number } }>('/parties', req);
        return data.data;
    },

    /**
     * 파티 지원
     * POST /api/parties/apply
     */
    async applyParty(req: PartyApplyReqDTO) {
        const { data } = await api.post<{ code: string }>('/parties/apply', req);
        return data;
    },

    /**
     * 내 파티 목록 조회 (관리용)
     * GET /api/parties/my
     */
    async getMyParties() {
        const { data } = await api.get<{ code: string; data: Party[] }>('/parties/my');
        return data.data;
    },

    /**
     * 파티 지원자 목록 조회 (파티장용)
     * GET /api/parties/{partyId}/applicants
     */
    async getApplicants(partyId: number) {
        const { data } = await api.get<{ code: string; data: PartyApplicantResDTO[] }>(`/parties/${partyId}/applicants`);
        return data.data;
    },

    /**
     * 지원자 수락/거절 결정
     * PATCH /api/parties/applicants/{applicantId}
     */
    async decideApplicant(applicantId: number, req: ApplicantDecisionReqDTO) {
        const { data } = await api.patch<{ code: string }>(`/parties/applicants/${applicantId}`, req);
        return data;
    }
};

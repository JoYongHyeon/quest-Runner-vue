import api from './axios';
import type { ApplicantStatus, Party, SlotStatus } from "../types/Party.ts";
import type { Position } from "../types/Member.ts";

// --- DTO Types ---

/** [DTO] 파티 검색 조건 */
export interface PartySearchCondition {
    position?: Position;
    page?: number;
    size?: number;
}

/** [DTO] 파티 생성 시 슬롯 요청 데이터 */
export interface PartySlotCreateDTO {
    position: Position;
    techStacks: string[];
}

/** [DTO] 파티 수정 시 슬롯 요청 데이터 */
export interface PartySlotUpdateDTO {
    slotId?: number;
    position: Position;
    techStacks: string[];
    status?: SlotStatus;
}

/** [DTO] 파티 초대 링크 정보 */
export interface PartyLinkDTO {
    label: string;
    url: string;
}

/** [DTO] 파티 생성 요청 */
export interface PartyCreateReqDTO {
    title: string;
    content: string;
    slots: PartySlotCreateDTO[];
    linkList: PartyLinkDTO[];
}

/** [DTO] 파티 수정 요청 */
export interface PartyUpdateReqDTO {
    title: string;
    content: string;
    slots: PartySlotUpdateDTO[];
    linkList: PartyLinkDTO[];
}

/** [DTO] 파티 지원 요청 */
export interface PartyApplyReqDTO {
    slotId: number;
    message: string;
}

/** [DTO] 지원자 수락/거절 요청 */
export interface ApplicantDecisionReqDTO {
    status: 'ACCEPTED' | 'REJECTED';
}

/** [DTO] 파티 목록 조회 응답 (Page) */
export interface PartyListResDTO {
    content: Party[];
    pageable: any;
    totalPages: number;
    totalElements: number;
    last: boolean;
}

/** [Inner DTO] 매칭된 멤버 정보 */
export interface MatchedMemberDTO {
    memberId: number;
    nickname: string;
    gitUrl?: string;
    blogUrl?: string;
    /** [NEW] 추방 API 호출을 위한 식별자 */
    applicantId: number; 
}

/** 
 * [DTO] 지원자 상세 정보 (목록 및 모달용) 
 * - [Update] 평판 시스템 통계 데이터 포함
 */
export interface PartyApplicantResDTO {
    applicantId: number;
    memberId: number;
    nickname: string;
    position: string;
    message: string;
    status: ApplicantStatus;
    appliedAt: string;
    gitUrl?: string;
    blogUrl?: string;
    resumeLink?: string;

    // --- [NEW] Reputation Data (백엔드 ReputationVO 연동) ---
    /** 성공적으로 완료한 퀘스트 수 */
    completedCount: number;
    /** 강제 추방당한 횟수 */
    kickedCount: number;
    /** 자진 탈퇴한 횟수 */
    quitCount: number;
    /** 현재 참여 중(IN_PROGRESS)인 퀘스트 수 */
    activeQuestCount: number;
    /** 가장 최근 추방당했을 때의 사유 */
    lastKickedReason?: string;
}

/** 
 * [DTO] 슬롯 상세 정보
 * - [Update] 리더 조회 시 해당 슬롯 지원자 목록(applicants) 포함
 */
export interface SlotDetailDTO {
    slotId: number;
    position: Position;
    status: SlotStatus;
    techStacks: string[];
    matchedMember?: MatchedMemberDTO;
    /** [NEW] 해당 슬롯에 지원한 지원자 목록 (리더 전용) */
    applicants?: PartyApplicantResDTO[]; 
}

/** [DTO] 파티 상세 조회 응답 */
export interface PartyDetailResDTO {
    partyId: number;
    title: string;
    content: string;
    createdAt: string;
    startedAt?: string;
    completedAt?: string;
    leaderId: number;
    leaderNickname: string;
    status: string; 
    region?: string;
    slots: SlotDetailDTO[];
    linkList?: PartyLinkDTO[];
    myApplicantStatus?: ApplicantStatus;
    changeReason?: string;
}

/** [DTO] 내가 지원한 파티 목록 조회 응답 */
export interface PartyApplicationResDTO {
    applicantId: number;
    partyId: number;
    title: string;
    leaderNickname: string;
    position: Position;
    status: ApplicantStatus; 
    partyStatus: string; 
    appliedAt: string;
}

/** [DTO] 강제 추방 요청 */
export interface PartyKickReqDTO {
    reason: string;
}

/**
 * Party API Service
 */
export const partyApi = {
    async getPartyList(condition: PartySearchCondition) {
        const { data } = await api.get<{ code: string; data: PartyListResDTO }>('/parties', { params: condition });
        return data.data;
    },
    async getPartyDetail(partyId: number) {
        const { data } = await api.get<{ code: string; data: PartyDetailResDTO }>(`/parties/${partyId}`);
        return data.data;
    },
    async createParty(req: PartyCreateReqDTO) {
        const { data } = await api.post<{ code: string; data: { partyId: number } }>('/parties', req);
        return data.data;
    },
    async updateParty(partyId: number, req: PartyUpdateReqDTO) {
        const { data } = await api.patch<{ code: string }>(`/parties/${partyId}`, req);
        return data;
    },
    async applyParty(req: PartyApplyReqDTO) {
        const { data } = await api.post<{ code: string }>('/parties/apply', req);
        return data;
    },
    async getMyParties() {
        const { data } = await api.get<{ code: string; data: Party[] }>('/parties/my');
        return data.data;
    },
    async getMyAppliedParties() {
        const { data } = await api.get<{ code: string; data: PartyApplicationResDTO[] }>('/parties/my-applied');
        return data.data;
    },
    async cancelApplication(applicantId: number) {
        const { data } = await api.delete<{ code: string }>(`/parties/applications/${applicantId}`);
        return data;
    },
    async quitParty(applicantId: number) {
        const { data } = await api.patch<{ code: string }>(`/parties/applications/${applicantId}/quit`);
        return data;
    },
    async getApplicants(partyId: number) {
        const { data } = await api.get<{ code: string; data: PartyApplicantResDTO[] }>(`/parties/${partyId}/applicants`);
        return data.data;
    },
    async decideApplicant(applicantId: number, req: ApplicantDecisionReqDTO) {
        const { data } = await api.patch<{ code: string }>(`/parties/applicants/${applicantId}`, req);
        return data;
    },
    async kickApplicant(applicantId: number, req: PartyKickReqDTO) {
        const { data } = await api.patch<{ code: string }>(`/parties/applicants/${applicantId}/kick`, req);
        return data;
    },
    async cancelParty(partyId: number) {
        return api.patch(`/parties/${partyId}/cancel`);
    },
    async startQuest(partyId: number) {
        return api.patch(`/parties/${partyId}/start`);
    },
    async completeQuest(partyId: number) {
        return api.patch(`/parties/${partyId}/complete`);
    }
};

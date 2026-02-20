import api from './axios';
import type { ApplicantStatus, Party, SlotStatus } from "../types/Party.ts";
import type { Position } from "../types/Member.ts";

// --- DTO Types ---

/**
 * [DTO] 파티 검색 조건 (QueryDSL 필터링용)
 */
export interface PartySearchCondition {
    /** 검색할 포지션 (백엔드, 프론트엔드 등) */
    position?: Position;
    /** 페이지 번호 (0부터 시작) */
    page?: number;
    /** 페이지 크기 */
    size?: number;
}

/**
 * [DTO] 파티 생성 시 슬롯(Slot) 요청 데이터
 */
export interface PartySlotCreateDTO {
    /** 모집 포지션 */
    position: Position;
    /** 요구 기술 스택 목록 */
    techStacks: string[];
}

/**
 * [DTO] 파티 수정 시 슬롯(Slot) 요청 데이터
 */
export interface PartySlotUpdateDTO {
    /** 슬롯 식별자 (수정 시 필수, 신규 생성 시 없음) */
    slotId?: number;
    /** 모집 포지션 */
    position: Position;
    /** 요구 기술 스택 목록 */
    techStacks: string[];
    /** 슬롯 상태 (참고용, 실제 수정은 서버 로직 따름) */
    status?: SlotStatus;
}

/**
 * [DTO] 파티 초대 링크 정보 (Key-Value)
 */
export interface PartyLinkDTO {
    /** 링크 라벨 (예: 디스코드, 노션) */
    label: string;
    /** 초대 URL */
    url: string;
}

/**
 * [DTO] 파티 생성 요청
 */
export interface PartyCreateReqDTO {
    /** 파티 제목 (5~100자) */
    title: string;
    /** 파티 상세 내용 */
    content: string;
    /** 모집 슬롯 목록 (최소 1개) */
    slots: PartySlotCreateDTO[];
    /** 초대 링크 목록 */
    linkList: PartyLinkDTO[];
}

/**
 * [DTO] 파티 수정 요청
 */
export interface PartyUpdateReqDTO {
    /** 파티 제목 */
    title: string;
    /** 파티 상세 내용 */
    content: string;
    /** 모집 슬롯 목록 (수정 포함) */
    slots: PartySlotUpdateDTO[];
    /** 초대 링크 목록 */
    linkList: PartyLinkDTO[];
}

/**
 * [DTO] 파티 지원 요청
 */
export interface PartyApplyReqDTO {
    /** 지원할 슬롯 ID */
    slotId: number;
    /** 지원 메시지 (최대 100자) */
    message: string;
}

/**
 * [DTO] 지원자 수락/거절 요청
 */
export interface ApplicantDecisionReqDTO {
    /** 결정 상태 (ACCEPTED | REJECTED) */
    status: 'ACCEPTED' | 'REJECTED';
}

/**
 * [DTO] 파티 목록 조회 응답 (Page)
 */
export interface PartyListResDTO {
    /** 파티 목록 데이터 */
    content: Party[];
    /** 페이징 정보 (Spring Data Pageable) */
    pageable: any;
    /** 전체 페이지 수 */
    totalPages: number;
    /** 전체 데이터 수 */
    totalElements: number;
    /** 마지막 페이지 여부 */
    last: boolean;
}

/**
 * [Inner DTO] 매칭된 멤버 정보
 */
export interface MatchedMemberDTO {
    /** 회원 ID */
    memberId: number;
    /** 닉네임 */
    nickname: string;
    /** 깃허브 링크 (Optional) */
    gitUrl?: string;
    /** 블로그 링크 (Optional) */
    blogUrl?: string;
}

/**
 * [DTO] 슬롯 상세 정보 (매칭 멤버 포함)
 * - 기존 PartySlot 타입을 확장하거나 대체합니다.
 */
export interface SlotDetailDTO {
    slotId: number;
    position: Position;
    status: SlotStatus;
    techStacks: string[];
    /** 매칭된 멤버 정보 (LOCKED 상태일 때만 존재) */
    matchedMember?: MatchedMemberDTO;
}

/**
 * [DTO] 파티 상세 조회 응답
 */
export interface PartyDetailResDTO {
    partyId: number;
    title: string;
    content: string;
    createdAt: string;
    /** 리더 식별자 */
    leaderId: number;
    leaderNickname: string;
    status: string; // PartyStatus
    region?: string;
    
    /** 슬롯 목록 (매칭 정보 포함) */
    slots: SlotDetailDTO[];
    
    /** 멤버 전용 초대 링크 (권한 있을 때만) */
    linkList?: PartyLinkDTO[];
    /** 나의 지원 상태 (로그인 유저) */
    myApplicantStatus?: ApplicantStatus;
    
    /** 상태 변경 사유 (추방/취소 등) */
    changeReason?: string;
}

/**
 * [DTO] 내가 지원한 파티 목록 조회 응답
 */
export interface PartyApplicationResDTO {
    /** 지원 내역 식별자 (취소/탈퇴 시 필요) */
    applicantId: number;
    partyId: number;
    title: string;
    leaderNickname: string;
    position: Position;
    /** 지원 상태 (PENDING, ACCEPTED, REJECTED, QUIT, KICKED) */
    status: ApplicantStatus; 
    appliedAt: string;
}

/**
 * [DTO] 파티 지원자 목록 조회 응답 (파티장용)
 */
export interface PartyApplicantResDTO {
    applicantId: number;
    memberId: number;
    nickname: string;
    position: Position;
    message: string;
    status: ApplicantStatus;
    appliedAt: string;
    gitUrl?: string;
    blogUrl?: string;
    resumeLink?: string;
}

/**
 * [DTO] 강제 추방 요청
 */
export interface PartyKickReqDTO {
    /** 추방 사유 (필수) */
    reason: string;
}

/**
 * Party API Service
 * - 파티(Quest)와 관련된 모든 비즈니스 로직 API 호출을 담당합니다.
 */
export const partyApi = {

    /**
     * 파티 목록을 검색 조건에 따라 조회합니다.
     * GET /api/parties
     * @param condition 검색 필터 및 페이징 정보
     */
    async getPartyList(condition: PartySearchCondition) {
        const { data } = await api.get<{ code: string; data: PartyListResDTO }>('/parties', {
            params: condition
        });
        return data.data;
    },

    /**
     * 파티의 상세 정보를 조회합니다.
     * GET /api/parties/{partyId}
     * @param partyId 조회할 파티 ID
     */
    async getPartyDetail(partyId: number) {
        const { data } = await api.get<{ code: string; data: PartyDetailResDTO }>(`/parties/${partyId}`);
        return data.data;
    },

    /**
     * 새로운 파티를 생성합니다.
     * POST /api/parties
     * @param req 파티 생성 요청 데이터
     * @returns 생성된 파티 ID가 포함된 객체
     */
    async createParty(req: PartyCreateReqDTO) {
        const { data } = await api.post<{ code: string; data: { partyId: number } }>('/parties', req);
        return data.data;
    },

    /**
     * 기존 파티 정보를 수정합니다.
     * PATCH /api/parties/{partyId}
     * @param partyId 수정할 파티 ID
     * @param req 파티 수정 요청 데이터 (slotId 포함)
     */
    async updateParty(partyId: number, req: PartyUpdateReqDTO) {
        const { data } = await api.patch<{ code: string }>(`/parties/${partyId}`, req);
        return data;
    },

    /**
     * 특정 파티의 슬롯에 지원합니다.
     * POST /api/parties/apply
     * @param req 지원 요청 데이터 (slotId, message)
     */
    async applyParty(req: PartyApplyReqDTO) {
        const { data } = await api.post<{ code: string }>('/parties/apply', req);
        return data;
    },

    /**
     * 내가 생성한 파티 목록을 조회합니다. (리더 권한)
     * GET /api/parties/my
     */
    async getMyParties() {
        const { data } = await api.get<{ code: string; data: Party[] }>('/parties/my');
        return data.data;
    },

    /**
     * 내가 지원한 파티 목록을 조회합니다. (지원자 권한)
     * GET /api/parties/my-applied
     */
    async getMyAppliedParties() {
        const { data } = await api.get<{ code: string; data: PartyApplicationResDTO[] }>('/parties/my-applied');
        return data.data;
    },

    /**
     * 지원을 취소합니다. (승인 전 PENDING 상태일 때만 가능)
     * DELETE /api/parties/applications/{applicantId}
     */
    async cancelApplication(applicantId: number) {
        const { data } = await api.delete<{ code: string }>(`/parties/applications/${applicantId}`);
        return data;
    },

    /**
     * 파티를 탈퇴합니다. (승인 후 ACCEPTED 상태일 때만 가능)
     * PATCH /api/parties/applications/{applicantId}/quit
     */
    async quitParty(applicantId: number) {
        const { data } = await api.patch<{ code: string }>(`/parties/applications/${applicantId}/quit`);
        return data;
    },

    /**
     * 내 파티에 지원한 지원자 목록을 조회합니다. (파티장 전용)
     * GET /api/parties/{partyId}/applicants
     * @param partyId 파티 ID
     */
    async getApplicants(partyId: number) {
        const { data } = await api.get<{ code: string; data: PartyApplicantResDTO[] }>(`/parties/${partyId}/applicants`);
        return data.data;
    },

    /**
     * 지원자를 수락하거나 거절합니다.
     * PATCH /api/parties/applicants/{applicantId}
     * @param applicantId 지원 내역 ID
     * @param req 결정 상태 (ACCEPTED | REJECTED)
     */
    async decideApplicant(applicantId: number, req: ApplicantDecisionReqDTO) {
        const { data } = await api.patch<{ code: string }>(`/parties/applicants/${applicantId}`, req);
        return data;
    },

    /**
     * 지원자를 강제 추방합니다. (파티장 권한)
     * PATCH /api/parties/applicants/{applicantId}/kick
     * @param applicantId 추방할 지원 내역 ID
     * @param req 추방 사유
     */
    async kickApplicant(applicantId: number, req: PartyKickReqDTO) {
        const { data } = await api.patch<{ code: string }>(`/parties/applicants/${applicantId}/kick`, req);
        return data;
    },

    /**
     * 파티 모집을 취소합니다. (파티장 전용)
     * PATCH /api/parties/{partyId}/cancel
     */
    async cancelParty(partyId: number) {
        const { data } = await api.patch<{ code: string }>(`/parties/${partyId}/cancel`);
        return data;
    },

    /**
     * 퀘스트를 공식적으로 시작합니다. (파티장 전용)
     * - [P-S006] RECRUITING -> IN_PROGRESS 상태로 변경됩니다.
     */
    async startQuest(partyId: number) {
        const { data } = await api.patch<{ code: string }>(`/parties/${partyId}/start`);
        return data;
    },

    /**
     * 퀘스트를 성공적으로 완료(종료) 합니다.
     * - [P-S007] IN_PROGRESS -> COMPLETED 상태로 변경됩니다.
     */
    async completeQuest(partyId: number) {
        const { data } = await api.patch<{ code: string }>(`/parties/${partyId}/complete`);
        return data;
    }
};

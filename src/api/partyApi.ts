import api from './axios';
import type { ApplicantStatus, Party } from "../types/Party.ts";
import type { Position } from "../types/Member.ts";

// --- DTO Types ---

export interface PartySearchCondition {
    position?: Position;
    page?: number;
    size?: number;
}

export interface PartySlotCreateDTO {
    position: Position;
    techStacks: string[];
}

// [New] 파티 링크 DTO (Key-Value)
export interface PartyLinkDTO {
    label: string;
    url: string;
}

export interface PartyCreateReqDTO {
    title: string;
    content: string;
    slots: PartySlotCreateDTO[];
    linkList: PartyLinkDTO[]; // [수정] chatUrl -> linkList (다중 링크 지원)
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
    linkList?: PartyLinkDTO[]; // 멤버일 경우에만 값이 채워져서 옴
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
 */
export const partyApi = {

    async getPartyList(condition: PartySearchCondition) {
        const { data } = await api.get<{ code: string; data: PartyListResDTO }>('/parties', {
            params: condition
        });
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

    async applyParty(req: PartyApplyReqDTO) {
        const { data } = await api.post<{ code: string }>('/parties/apply', req);
        return data;
    },

    async getMyParties() {
        const { data } = await api.get<{ code: string; data: Party[] }>('/parties/my');
        return data.data;
    },

    async getApplicants(partyId: number) {
        const { data } = await api.get<{ code: string; data: PartyApplicantResDTO[] }>(`/parties/${partyId}/applicants`);
        return data.data;
    },

    async decideApplicant(applicantId: number, req: ApplicantDecisionReqDTO) {
        const { data } = await api.patch<{ code: string }>(`/parties/applicants/${applicantId}`, req);
        return data;
    }
};
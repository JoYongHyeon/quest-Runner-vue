import type { Position, Region } from './Member';

export type SlotStatus = 'OPEN' | 'FILLED' | 'LEADER' | 'LOCKED';

// 백엔드 PartyStatus Enum 대응
export type PartyStatus = 'RECRUITING' | 'COMPLETED';

export interface PartySlot {
    slotId: number;
    position: Position;
    status: SlotStatus;
}

export interface Party {
    partyId: number;
    title: string;
    content: string;
    region: Region;
    createdAt: string;
    leaderNickname: string;
    slots: PartySlot[];
    status: PartyStatus;
}

export type ApplicantStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Applicant {
    applicantId: number;
    nickname: string;
    position: Position;
    message: string;
    status: ApplicantStatus;
}
export type Position = 'BACKEND' | 'FRONTEND' | 'DESIGN' | 'PM';
export type Region = 'SEOUL' | 'GYEONGGI' | 'DAEJEON' | 'BUSAN' | 'GWANGJU' | 'ETC';
export type MemberStatus = 'PENDING_PROFILE' | 'ACTIVE';

export interface Member {
    memberId: number;
    nickname: string;
    email: string; // Added based on Entity
    position: Position;
    region: Region;
    techStacks: string[];
    intro?: string;
    gitUrl?: string;
    blogUrl?: string;
    resumeLink?: string;
    status: MemberStatus;
    lastLoginAt: string;
}

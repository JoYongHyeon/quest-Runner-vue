export type Position =
    | 'BACKEND'
    | 'FRONTEND'
    | 'DEVOPS'
    | 'DBA'
    | 'PM'
    | 'DESIGN';

export type MemberStatus = 'PENDING_PROFILE' | 'ACTIVE';

export interface Member {
    id: number;
    nickname: string;
    email: string;
    position: Position;
    techStacks: string[];
    intro?: string;
    gitUrl?: string;
    blogUrl?: string;
    resumeLink?: string;
    status: MemberStatus;
}

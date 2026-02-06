import type { Party } from '../types/Party';

export const mockParties: Party[] = [
    {
        partyId: 1,
        title: "사이드 프로젝트 - 퀘스트 러너 함께 만드실 분!",
        content: "RPG 감성의 팀 빌딩 플랫폼을 만들고 있습니다. 백엔드 개발자 1분 모십니다.",
        region: "SEOUL",
        createdAt: "2026-02-06",
        leaderNickname: "개발왕",
        status: "RECRUITING",
        slots: [
            { slotId: 1, position: "BACKEND", status: "OPEN" },
            { slotId: 2, position: "FRONTEND", status: "FILLED" },
            { slotId: 3, position: "DESIGN", status: "OPEN" }
        ]
    },
    {
        partyId: 2,
        title: "Spring Boot 3 + JPA 스터디 모집합니다 (강남)",
        content: "매주 토요일 오전 10시 강남역 인근 카페에서 스터디 진행합니다. 초보 환영!",
        region: "SEOUL",
        createdAt: "2026-02-05",
        leaderNickname: "스프링조아",
        status: "RECRUITING",
        slots: [
            { slotId: 4, position: "BACKEND", status: "OPEN" },
            { slotId: 5, position: "BACKEND", status: "OPEN" }
        ]
    },
    {
        partyId: 3,
        title: "리액트 네이티브로 앱 출시하실 분?",
        content: "기획은 어느정도 나와있습니다. 디자이너 1분, 프론트 2분 구해요.",
        region: "ETC",
        createdAt: "2026-02-04",
        leaderNickname: "앱메이커",
        status: "RECRUITING",
        slots: [
            { slotId: 6, position: "FRONTEND", status: "OPEN" },
            { slotId: 7, position: "DESIGN", status: "OPEN" }
        ]
    }
];

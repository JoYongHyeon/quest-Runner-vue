import type { Position } from '../types/Member';

// 1. 포지션 정의 (옵션 리스트)
export const POSITION_OPTIONS: { value: Position; label: string }[] = [
    { value: 'BACKEND', label: '백엔드' },
    { value: 'FRONTEND', label: '프론트엔드' },
    { value: 'DEVOPS', label: 'DevOps' },
    { value: 'DBA', label: 'DBA' },
    { value: 'PM', label: '기획자 (PM)' },
    { value: 'DESIGN', label: '디자이너' },
];

// 2. 전체 기술 스택 리스트 (프로필 설정용 - 주력 언어 위주)
export const ALL_TECH_STACKS = [
    'Java', 'Kotlin', 'Python', 'Node.js', 'Go', 
    'JavaScript', 'TypeScript', 'React', 'Vue', 
    'Swift', 'Flutter', 'C', 'C++', '기타'
];

// 3. 포지션별 추천 기술 스택 (파티 생성용 - 더 상세하게)
export const TECH_PRESETS: Record<string, string[]> = {
    'BACKEND': ['Java', 'Spring Boot', 'Node.js', 'Python', 'Django', 'Go', 'Kotlin', 'MySQL', 'Redis'],
    'FRONTEND': ['Vue.js', 'React', 'TypeScript', 'Next.js', 'Svelte', 'Tailwind CSS'],
    'DEVOPS': ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Linux'],
    'DBA': ['MySQL', 'PostgreSQL', 'Oracle', 'MongoDB', 'Redis', 'Elasticsearch'],
    'PM': ['Jira', 'Notion', 'Slack', 'Figma', 'Excel'],
    'DESIGN': ['Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator'],
};

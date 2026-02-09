/**
 * ISO 날짜 문자열을 "YYYY.MM.DD HH:mm" 형식으로 변환합니다.
 * @param isoString ISO 8601 형식의 날짜 문자열 (예: 2026-02-09T13:56:27...)
 * @returns 포맷팅된 날짜 문자열
 */
export const formatDateTime = (isoString: string): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}.${month}.${day} ${hours}:${minutes}`;
};

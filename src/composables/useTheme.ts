import { ref, onMounted } from 'vue';

// Singleton State (전역 상태 공유)
const isDark = ref(false);

export function useTheme() {
    
    const initTheme = () => {
        // 1. LocalStorage 우선 확인
        const savedTheme = localStorage.getItem('theme');
        
        // 2. 저장된 게 없으면 시스템 설정 확인
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            isDark.value = true;
            document.documentElement.classList.add('dark');
        } else {
            isDark.value = false;
            document.documentElement.classList.remove('dark');
        }
    };

    const toggleTheme = () => {
        isDark.value = !isDark.value;
        if (isDark.value) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // 컴포넌트 마운트 시 초기화 실행
    onMounted(() => initTheme());

    return {
        isDark,
        toggleTheme
    };
}

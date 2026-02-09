import {onMounted, onUnmounted, ref} from 'vue';

// 전역 상태 (Singleton Pattern)
// 앱 전체에서 사이드바 상태를 공유하기 위해 함수 외부에 선언
const isSidebarOpen = ref(window.innerWidth >= 1024); // 데스크탑 기준 기본값: Open

export function useSidebar() {
    
    const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
    };

    const closeSidebar = () => {
        isSidebarOpen.value = false;
    };

    const openSidebar = () => {
        isSidebarOpen.value = true;
    };

    const handleResize = () => {
        if (window.innerWidth < 1024) {
            // 좁아지면 닫기
            isSidebarOpen.value = false;
        } else {
            // 넓어지면 열기
            isSidebarOpen.value = true;
        }
    }

    onMounted(() => window.addEventListener('resize', handleResize))
    onUnmounted(() => window.removeEventListener('resize', handleResize))

    return {
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
        openSidebar
    };
}

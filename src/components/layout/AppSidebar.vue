<script setup lang="ts">
import { useSidebar } from '../../composables/useSidebar';

// 사이드바 상태 관리 Hook 사용
const { isSidebarOpen } = useSidebar();

/**
 * 메뉴 아이템 정의
 * - icon: 이모지 또는 아이콘 컴포넌트
 * - label: 메뉴 표시명
 * - link: 이동 경로
 */
const menuItems = [
    { icon: '🏠', label: '홈', link: '/' },
    { icon: '🔥', label: '인기', link: '/popular' },
    { icon: '🛡️', label: '내 파티', link: '/my-party' },
    { icon: '📜', label: '지원 현황', link: '/applications' },
];
</script>

<template>
  <!-- 
    App Sidebar Component (Left Navigation)
    - 데스크탑: 고정 위치 (Fixed), 토글 시 너비 변경 (Width Transition)
    - 모바일: 화면 밖으로 숨김, 토글 시 등장 (Translate Transition)
    - 다크 모드 지원: bg-[var(--color-reddit-dark)]
  -->
  <aside 
    class="fixed lg:fixed top-14 left-0 h-[calc(100vh-56px)] bg-white border-r border-gray-200 overflow-y-auto z-40
           dark:bg-[var(--color-reddit-dark)] dark:border-[var(--color-reddit-border)]
           transition-all duration-300 ease-in-out"
    :class="[
        // 열림: 너비 270px, 위치 0
        isSidebarOpen ? 'w-[270px] translate-x-0' : 
        // 닫힘: 너비 0, 위치 -100% (모바일) / 투명화 (데스크탑)
        'w-0 -translate-x-full lg:w-0 lg:translate-x-0 opacity-0 lg:opacity-100 lg:invisible'
    ]"
  >
    <!-- 내부 네비게이션 컨테이너 (너비 고정으로 찌그러짐 방지) -->
    <nav class="p-2 space-y-1 w-[270px]"> 
        
        <!-- 메인 메뉴 루프 -->
        <a v-for="item in menuItems" :key="item.label" :href="item.link" 
           class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors text-sm
                  dark:text-[var(--color-reddit-text)] dark:hover:bg-[var(--color-reddit-hover)]">
            <span class="text-lg">{{ item.icon }}</span>
            <span class="whitespace-nowrap">{{ item.label }}</span>
        </a>

        <!-- 구분선 -->
        <hr class="my-4 border-gray-200 mx-4 dark:border-[var(--color-reddit-border)]"/>
        
        <!-- 하단 리소스 섹션 -->
        <div class="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-[var(--color-reddit-text-muted)] whitespace-nowrap">
            리소스
        </div>
        <a href="#" class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors text-sm
                   dark:text-[var(--color-reddit-text)] dark:hover:bg-[var(--color-reddit-hover)]">
            <span class="whitespace-nowrap">ℹ️ 소개</span>
        </a>
    </nav>
  </aside>
</template>

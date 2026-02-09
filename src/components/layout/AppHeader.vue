<script setup lang="ts">
import { useTheme } from '../../composables/useTheme';
import { useAuth } from '../../composables/useAuth';
import UserDropdown from './UserDropdown.vue'; // 드롭다운 컴포넌트 import
import { useRouter } from 'vue-router';

// 테마 관리 (Dark/Light)
const { isDark, toggleTheme } = useTheme();

// 인증 관리 (로그인 상태 및 현재 유저 정보)
const { isLoggedIn, login, currentUser } = useAuth();
const router = useRouter();

/**
 * 만들기 버튼 클릭 핸들러
 * - 온보딩(PENDING_PROFILE) 상태일 경우 생성을 막고 프로필 설정으로 유도합니다.
 * - 정상(ACTIVE) 상태일 경우 생성 페이지로 이동합니다.
 */
const handleCreateClick = () => {
    if (currentUser.value?.status === 'PENDING_PROFILE') {
        if (confirm('모험가 등록(프로필 완성)을 먼저 진행해야 퀘스트를 생성할 수 있습니다.\n이동하시겠습니까?')) {
            router.push('/onboarding');
        }
        return;
    }
    router.push('/create');
};
</script>

<template>
  <!-- 
    App Header Component 
    - 상단 고정 네비게이션 바
    - 로고, 검색창, 테마 토글, 유저 메뉴 포함
  -->
  <header class="fixed top-0 z-50 w-full h-14 bg-white border-b border-gray-200 flex items-center px-4 justify-between transition-colors duration-300 
                 dark:bg-[var(--color-reddit-dark)] dark:border-[var(--color-reddit-border)]">
    
    <!-- 1. 좌측 로고 영역 -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 cursor-pointer" @click="$router.push('/')">
        <!-- 로고 아이콘 -->
        <div class="w-8 h-8 bg-[#FF4500] rounded-full flex items-center justify-center text-white font-bold text-lg">
            Q
        </div>
        <!-- 로고 텍스트 (모바일 숨김) -->
        <span class="text-lg font-bold hidden md:block tracking-tight text-gray-800 dark:text-[var(--color-reddit-text)]">
            quest-runner
        </span>
      </div>
    </div>

    <!-- 2. 중앙 검색창 영역 -->
    <div class="flex-1 max-w-2xl mx-6 hidden sm:block">
      <div class="relative group">
        <!-- 검색 아이콘 -->
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-gray-400">🔍</span>
        </div>
        <!-- 검색 입력 필드 -->
        <input type="text" 
               class="block w-full pl-10 pr-4 py-1.5 border border-transparent rounded-full bg-gray-100 hover:bg-white hover:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all 
                      dark:bg-[#272729] dark:text-white dark:hover:bg-[#272729] dark:hover:border-gray-500 dark:focus:bg-[#272729] dark:focus:border-white" 
               placeholder="Quest Runner 검색">
      </div>
    </div>

    <!-- 3. 우측 메뉴 영역 (테마 토글, 로그인/유저메뉴) -->
    <div class="flex items-center gap-3">
        
        <!-- 테마 토글 버튼 -->
        <button @click="toggleTheme" 
                class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[var(--color-reddit-hover)] transition-colors text-xl"
                :title="isDark ? '라이트 모드' : '다크 모드'">
            {{ isDark ? '🌞' : '🌚' }}
        </button>

        <!-- [분기] 로그인 상태에 따라 UI 변경 -->
        <template v-if="isLoggedIn">
            <!-- Case A: 로그인 완료 (퀘스트 생성 버튼 + 드롭다운 메뉴) -->
            <!-- [수정됨] 클릭 시 handleCreateClick 호출 -->
            <button @click="handleCreateClick"
                    class="hidden md:flex btn rounded-full px-4 py-1.5 text-sm font-bold border border-gray-300 hover:bg-gray-50 
                           dark:border-gray-600 dark:text-white dark:hover:bg-[var(--color-reddit-hover)]">
                <span>+ 만들기</span>
            </button>
            
            <!-- 유저 드롭다운 메뉴 (아바타 클릭 시 열림) -->
            <UserDropdown />
        </template>

        <template v-else>
            <!-- Case B: 비로그인 (로그인 버튼) -->
            <!-- 레딧 스타일 주황색 로그인 버튼 -->
            <button @click="login"
                    class="btn px-8 py-1.5 rounded-full font-bold text-white bg-[#D93A00] hover:bg-[#C83500] transition-colors shadow-sm">
                로그인
            </button>
        </template>

    </div>
  </header>
</template>
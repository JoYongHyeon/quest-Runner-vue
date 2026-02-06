<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuth } from '../../composables/useAuth';
import { useRouter } from 'vue-router';

// 인증 상태 및 로그아웃 함수 가져오기 (수정됨: 할당 연산자 추가)
const { currentUser, logout } = useAuth();
const router = useRouter();

// 드롭다운 열림/닫힘 상태
const isOpen = ref(false);

/**
 * 드롭다운 토글
 */
const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

/**
 * 외부 클릭 시 드롭다운 닫기 (Event Listener)
 */
const closeDropdown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.user-dropdown-container')) {
        isOpen.value = false;
    }
};

onMounted(() => window.addEventListener('click', closeDropdown));
onUnmounted(() => window.removeEventListener('click', closeDropdown));

/**
 * 로그아웃 처리
 */
const handleLogout = () => {
    logout();
    isOpen.value = false;
    router.push('/'); // 로그아웃 후 홈으로 이동
};
</script>

<template>
  <div class="relative user-dropdown-container">
    <!-- 아바타 (Trigger) -->
    <div @click="toggleDropdown" 
         class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-300 transition-all dark:bg-gray-700">
         <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Adventurer" alt="User Avatar" />
    </div>

    <!-- 드롭다운 메뉴 (Absolute Position) -->
    <div v-if="isOpen" 
         class="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl border border-gray-200 py-1 z-50
                dark:bg-[#1A282D] dark:border-[#343536] overflow-hidden">
        
        <!-- 사용자 정보 (Header) -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-[#343536] bg-gray-50 dark:bg-[#202022]">
            <p class="text-sm font-bold text-gray-900 dark:text-[#D7DADC]">
                {{ currentUser?.nickname || '모험가' }}
            </p>
            <p class="text-xs text-gray-500 truncate dark:text-[#818384] mt-0.5">
                {{ currentUser?.email }}
            </p>
            <span v-if="currentUser?.status === 'ACTIVE'" 
                  class="mt-2 inline-block px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 rounded-full dark:bg-green-900/30 dark:text-green-400">
                활동 중
            </span>
            <span v-else 
                  class="mt-2 inline-block px-2 py-0.5 text-[10px] font-bold bg-yellow-100 text-yellow-700 rounded-full dark:bg-yellow-900/30 dark:text-yellow-400">
                온보딩 미완료
            </span>
        </div>

        <!-- 메뉴 아이템 -->
        <div class="py-1">
            <!-- 온보딩 안 된 경우만 노출 -->
            <router-link to="/onboarding" v-if="currentUser?.status === 'PENDING_PROFILE'"
               class="block px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold flex items-center gap-2 
                      dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40">
               <span>✨ 프로필 완성하기</span>
            </router-link>

            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-[#D7DADC] dark:hover:bg-[#272729]">
                👤 내 프로필
            </a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-[#D7DADC] dark:hover:bg-[#272729]">
                ⚙️ 설정
            </a>
        </div>

        <!-- 로그아웃 -->
        <div class="border-t border-gray-200 py-1 dark:border-[#343536]">
            <button @click="handleLogout" 
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2 dark:hover:bg-[#272729]">
                🚪 로그아웃
            </button>
        </div>
    </div>
  </div>
</template>
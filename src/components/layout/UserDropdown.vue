<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuth } from '../../composables/useAuth';
import { useRouter } from 'vue-router';

// 인증 상태 및 로그아웃 함수 가져오기
const { currentUser, logout } = useAuth();
const router = useRouter();

// 드롭다운 열림/닫힘 상태
const isOpen = ref(false);

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const closeDropdown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.user-dropdown-container')) {
        isOpen.value = false;
    }
};

onMounted(() => window.addEventListener('click', closeDropdown));
onUnmounted(() => window.removeEventListener('click', closeDropdown));

const handleLogout = () => {
    logout();
    isOpen.value = false;
    router.push('/'); 
};
</script>

<template>
  <div class="relative user-dropdown-container">
    <!-- 아바타 (Trigger) -->
    <div @click="toggleDropdown" 
         class="w-8 h-8 rounded bg-gray-200 overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-300 transition-all dark:bg-gray-700">
         <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Adventurer" alt="User Avatar" />
    </div>

    <!-- 드롭다운 메뉴 -->
    <div v-if="isOpen" 
         class="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl border border-gray-200 py-1 z-50
                dark:bg-[#1A282D] dark:border-[#343536] overflow-hidden">
        
        <!-- 사용자 정보 -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-[#343536] bg-gray-50 dark:bg-[#202022]">
            <p class="text-sm font-bold text-gray-900 dark:text-[#D7DADC]">
                {{ currentUser?.nickname || '모험가' }}
            </p>
            <p class="text-xs text-gray-500 truncate dark:text-[#818384] mt-0.5">
                {{ currentUser?.email }}
            </p>
            <!-- 온보딩 미완료 상태 표시 (클릭 시 프로필 이동) -->
            <span v-if="currentUser?.status === 'ACTIVE'" 
                  class="mt-2 inline-block px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 rounded-full dark:bg-green-900/30 dark:text-green-400">
                활동 중
            </span>
            <router-link v-else to="/profile" 
                  class="mt-2 inline-block px-2 py-0.5 text-[10px] font-bold bg-yellow-100 text-yellow-700 rounded-full cursor-pointer hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50">
                온보딩 미완료
            </router-link>
        </div>

        <!-- 메뉴 아이템 -->
        <div class="py-1">
            <router-link to="/my-party" 
               class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-[#D7DADC] dark:hover:bg-[#272729]">
                👑 내 파티 관리
            </router-link>

            <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-[#D7DADC] dark:hover:bg-[#272729]">
                👤 내 프로필
            </router-link>
            
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
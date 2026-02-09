<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSidebar } from '../../composables/useSidebar';
import iconHome from '@/assets/images/icons/main_home.png';
import iconIntro from '@/assets/images/icons/main_intro.png';
import iconTeam from '@/assets/images/icons/main_team.png';
import iconBug from '@/assets/images/icons/main_bug.png';

const { isSidebarOpen } = useSidebar();
const route = useRoute();

// 1. 상단 고정 메뉴 (토글 없음)
const fixedMenuItems = [
    { icon: iconHome, label: '홈', link: '/', type: 'image' },
    { icon: iconTeam, label: '내 파티', link: '/my-party', type: 'image' },
];

// 2. 하단 토글 메뉴 그룹
const menuGroups = ref([
    {
        title: 'COMMUNITIES',
        isOpen: true,
        items: [
            { icon: '🔥', label: '인기', link: '/popular', type: 'text' },
            { icon: '📜', label: '지원 현황', link: '/applications', type: 'text' },
        ]
    },
    {
        title: 'RESOURCES',
        isOpen: true,
        items: [
            { icon: iconIntro, label: '소개', link: '/about', type: 'image' },
            { icon: iconBug, label: '버그 제보', link: '/report', type: 'image' },
        ]
    }
]);

const toggleGroup = (index: number) => {
    menuGroups.value[index].isOpen = !menuGroups.value[index].isOpen;
};

// 현재 경로와 링크가 일치하는지 확인하는 함수
const isActive = (path: string) => route.path === path;
</script>

<template>
  <aside 
    class="fixed lg:fixed top-14 left-0 h-[calc(100vh-56px)] bg-white border-r border-gray-200 overflow-y-auto z-40
           dark:bg-[var(--color-reddit-dark)] dark:border-[var(--color-reddit-border)]
           transition-all duration-300 ease-in-out scrollbar-hide"
    :class="[
        isSidebarOpen ? 'w-[270px] translate-x-0' : 'w-0 -translate-x-full lg:w-0 lg:translate-x-0 opacity-0 lg:opacity-100 lg:invisible'
    ]"
  >
    <nav class="p-3 w-[270px]">
        
        <!-- 1. 상단 고정 메뉴 (Home, Popular) -->
        <div class="mb-3 space-y-1 border-b border-gray-200 dark:border-[#343536] pb-3">
            <router-link v-for="item in fixedMenuItems" :key="item.label" :to="item.link" 
               class="flex items-center gap-3 px-3 py-2 rounded transition-colors text-sm font-medium"
               :class="isActive(item.link) 
                   ? 'bg-gray-200 text-black dark:bg-[#272729] dark:text-[#D7DADC]' 
                   : 'text-gray-700 hover:bg-gray-100 dark:text-[#818384] dark:hover:bg-[#272729]'">
                
                <img v-if="item.type === 'image'" :src="item.icon" :alt="item.label" class="w-5 h-5 object-contain dark:invert" />
                <span v-else class="w-5 text-center text-lg">{{ item.icon }}</span>
                
                <span>{{ item.label }}</span>
            </router-link>
        </div>

        <!-- 2. 토글 메뉴 그룹 -->
        <div v-for="(group, index) in menuGroups" :key="group.title" class="mb-2">
            
            <!-- 그룹 헤더 -->
            <div @click="toggleGroup(index)"
                 class="flex items-center justify-between px-3 py-2 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-[#272729] transition-colors select-none group">
                
                <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider dark:text-[#818384] group-hover:text-gray-900 dark:group-hover:text-[#D7DADC]">
                    {{ group.title }}
                </span>
                
                <!-- Chevron Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
                     class="w-3 h-3 text-gray-500 transition-transform duration-200"
                     :class="group.isOpen ? 'rotate-180' : ''">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </div>

            <!-- 하위 메뉴 -->
            <div v-show="group.isOpen" class="mt-0.5 space-y-0.5">
                <router-link v-for="item in group.items" :key="item.label" :to="item.link" 
                   class="flex items-center gap-3 px-3 py-2 rounded transition-colors text-sm"
                   :class="isActive(item.link)
                       ? 'bg-gray-200 text-black dark:bg-[#272729] dark:text-[#D7DADC]' 
                       : 'text-gray-700 hover:bg-gray-100 dark:text-[#D7DADC] dark:hover:bg-[#272729]'">
                    
                    <!-- [수정됨] v-if / v-else 로직 확실하게 적용 -->
                    <img v-if="item.type === 'image'" :src="item.icon" :alt="item.label" class="w-5 h-5 object-contain dark:invert" />
                    <span v-else class="w-5 text-center text-lg">{{ item.icon }}</span>
                    
                    <span>{{ item.label }}</span>
                </router-link>
            </div>
        </div>

    </nav>
  </aside>
</template>

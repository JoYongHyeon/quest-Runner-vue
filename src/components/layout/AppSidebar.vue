<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSidebar } from '../../composables/useSidebar';

/**
 * AppSidebar.vue
 * - [Update] 이모지 및 PNG 아이콘을 제거하고 레딧 스타일의 모던한 SVG(Heroicons)로 전면 교체.
 */

const { isSidebarOpen } = useSidebar();
const route = useRoute();

// 1. 상단 고정 메뉴 (토글 없음)
const fixedMenuItems = [
    { 
        label: '홈', 
        link: '/', 
        svgPath: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' 
    },
    { 
        label: '내 퀘스트', 
        link: '/my-party', 
        svgPath: 'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z' 
    },
];

// 2. 하단 토글 메뉴 그룹
const menuGroups = ref([
    {
        title: 'EXPLORE',
        isOpen: true,
        items: [
            { 
                label: '퀘스트 아카이브', 
                link: '/archive', 
                svgPath: 'M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.49 4.49 0 0 0-1.757 4.306 4.438 4.438 0 0 0 2.731-2.73c.2-.59.04-1.258-.403-1.722-.444-.442-1.112-.603-1.703-.404Z' 
            },
            { 
                label: '커뮤니티', 
                link: '/community', 
                svgPath: 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155' 
            },
        ]
    },
    {
        title: 'RESOURCES',
        isOpen: true,
        items: [
            { 
                label: '소개', 
                link: '/about', 
                svgPath: 'm11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z' 
            },
            { 
                label: '버그 제보', 
                link: '/report', 
                svgPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z' 
            },
        ]
    }
]);

const toggleGroup = (index: number) => {
  if (menuGroups.value[index]) {
    menuGroups.value[index].isOpen = !menuGroups.value[index].isOpen;
  }
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
        
        <!-- 1. 상단 고정 메뉴 -->
        <div class="mb-3 space-y-1 border-b border-gray-200 dark:border-[#343536] pb-3">
            <router-link v-for="item in fixedMenuItems" :key="item.label" :to="item.link" 
               class="flex items-center gap-3 px-3 py-2.5 rounded transition-colors text-sm font-medium group"
               :class="isActive(item.link) 
                   ? 'bg-gray-200 text-black dark:bg-[#272729] dark:text-[#D7DADC]' 
                   : 'text-gray-700 hover:bg-gray-100 dark:text-[#818384] dark:hover:bg-[#272729]'">
                
                <!-- SVG Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
                     class="w-5 h-5 transition-colors"
                     :class="isActive(item.link) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 group-hover:text-gray-900 dark:text-[#818384] dark:group-hover:text-gray-300'">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="item.svgPath" />
                </svg>
                
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
                   class="flex items-center gap-3 px-3 py-2.5 rounded transition-colors text-sm group"
                   :class="isActive(item.link)
                       ? 'bg-gray-200 text-black dark:bg-[#272729] dark:text-[#D7DADC]' 
                       : 'text-gray-700 hover:bg-gray-100 dark:text-[#818384] dark:hover:bg-[#272729]'">
                    
                    <!-- SVG Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
                         class="w-5 h-5 transition-colors"
                         :class="isActive(item.link) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 group-hover:text-gray-900 dark:text-[#818384] dark:group-hover:text-gray-300'">
                        <path stroke-linecap="round" stroke-linejoin="round" :d="item.svgPath" />
                    </svg>
                    
                    <span>{{ item.label }}</span>
                </router-link>
            </div>
        </div>

    </nav>
  </aside>
</template>

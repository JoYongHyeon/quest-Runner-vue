<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from '../components/layout/AppHeader.vue';
import AppSidebar from '../components/layout/AppSidebar.vue';
import AppRightSidebar from '../components/layout/AppRightSidebar.vue';
import { useSidebar } from '../composables/useSidebar';
import { useRoute } from 'vue-router';

// Sidebar 상태에 따라 메인 컨텐츠의 margin-left 조정
const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
const route = useRoute();
</script>

<template>
  <div class="min-h-screen font-sans text-gray-900 pt-14 transition-colors duration-300 dark:text-[#D7DADC]">
    
    <!-- 1. Header -->
    <AppHeader />

    <!-- 2. Main Layout Container -->
    <div class="flex w-full"> 
      
      <!-- 3. Left Sidebar -->
      <AppSidebar />

      <!-- Sidebar Toggle Button -->
      <button 
        class="fixed top-20 z-[100] w-8 h-10 bg-white border border-gray-200 rounded-r-md flex items-center justify-center cursor-pointer shadow-sm text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300 ease-in-out
               dark:bg-[#1A282D] dark:border-[#343536] dark:text-gray-400 dark:hover:text-white dark:hover:bg-[#272729]"
        :class="isSidebarOpen ? 'left-[270px]' : 'left-0'"
        @click="toggleSidebar"
        title="메뉴 열기/닫기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <!-- 4. Center Content & Right Sidebar -->
      <main class="flex-1 min-w-0 p-0 md:p-0 transition-all duration-300 ease-in-out"
            :class="isSidebarOpen ? 'lg:ml-[270px]' : 'lg:ml-0'">
            
        <div class="flex justify-center w-full px-0 py-2">
            <!-- [수정] 사이드바 닫혔을 때 max-w를 1600px까지 확장하여 여백 최소화 -->
            <div class="flex gap-4 w-full transition-all duration-300"
                 :class="isSidebarOpen ? 'max-w-[1250px]' : 'max-w-[1500px]'">
                
                <!-- Page Content (Router View) -->
                <div class="flex-1 min-w-0" 
                     :class="route.meta.hideRightSidebar ? 'w-full' : ''">
                     <slot /> 
                </div>

                <!-- 5. Right Sidebar (Widgets) -->
                <AppRightSidebar v-if="!route.meta.hideRightSidebar" />
            </div>
        </div>
      </main>

    </div>

    <!-- Mobile Overlay -->
    <div v-if="isSidebarOpen" 
         class="fixed inset-0 bg-black/50 z-30 lg:hidden"
         @click="closeSidebar">
    </div>
  </div>
</template>

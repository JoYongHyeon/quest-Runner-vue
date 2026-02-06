<script setup lang="ts">
import AppHeader from '../components/layout/AppHeader.vue';
import AppSidebar from '../components/layout/AppSidebar.vue';
import AppRightSidebar from '../components/layout/AppRightSidebar.vue';
import { useSidebar } from '../composables/useSidebar';

// Sidebar 상태에 따라 메인 컨텐츠의 margin-left 조정
const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
</script>

<template>
  <div class="min-h-screen font-sans text-gray-900 pt-14 transition-colors duration-300 dark:text-[#D7DADC]">
    
    <!-- 1. Header -->
    <AppHeader />

    <!-- 2. Main Layout Container -->
    <div class="flex max-w-[100%] mx-auto">
      
      <!-- 3. Left Sidebar -->
      <AppSidebar />

      <!-- Sidebar Toggle Button (Floating on Border) -->
      <button 
        class="fixed top-20 z-50 w-8 h-10 bg-white border border-gray-200 rounded-r-md flex items-center justify-center cursor-pointer shadow-sm text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300 ease-in-out
               dark:bg-[#1A282D] dark:border-[#343536] dark:text-gray-400 dark:hover:text-white dark:hover:bg-[#272729]"
        :class="isSidebarOpen ? 'left-[270px]' : 'left-0'"
        @click="toggleSidebar"
        title="메뉴 열기/닫기"
      >
        <!-- Hamburger Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <!-- 4. Center Content & Right Sidebar -->
      <main class="flex-1 min-w-0 p-4 md:p-6 transition-all duration-300 ease-in-out"
            :class="isSidebarOpen ? 'lg:ml-[270px]' : 'lg:ml-0'">
            
        <div class="max-w-5xl mx-auto flex gap-6 items-start justify-center">
            
            <!-- Page Content (Router View) -->
            <div class="flex-1 min-w-0 max-w-3xl">
                 <slot /> 
            </div>

            <!-- 5. Right Sidebar (Widgets) -->
            <AppRightSidebar />
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
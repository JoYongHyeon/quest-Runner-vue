<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from '../components/layout/AppHeader.vue';
import AppSidebar from '../components/layout/AppSidebar.vue';
import AppRightSidebar from '../components/layout/AppRightSidebar.vue';
import { useSidebar } from '../composables/useSidebar';
import { useRoute } from 'vue-router';

/**
 * DefaultLayout.vue
 * - [Layout Final Polish] 목록을 화면 끝까지 더 넓게 확장하여 우측 여백을 최소화함.
 */

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

      <!-- 4. Center Content Area -->
      <main class="flex-1 min-w-0 transition-all duration-300 ease-in-out"
            :class="isSidebarOpen ? 'lg:ml-[270px]' : 'lg:ml-0'">
            
        <!-- [Fix] justify-center 상태에서 max-width 를 최대한으로 늘려 여백을 압축 -->
        <div class="flex justify-center w-full px-4 py-2">
            
            <!-- [Fix] max-width 를 1920px(Full HD 가로) 수준으로 확장 -->
            <div class="flex gap-6 w-full transition-all duration-300"
                 :class="isSidebarOpen ? 'max-w-[1800px]' : 'max-w-[2000px]'">
                
                <!-- Page Content: 이제 목록이 화면을 거의 가득 채우며 길게 늘어남 -->
                <div class="flex-1 min-w-0">
                     <slot /> 
                </div>

                <!-- 5. Right Sidebar (Widgets) -->
                <AppRightSidebar v-if="!route.meta.hideRightSidebar" class="hidden xl:block shrink-0" />
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

<style scoped>
main {
    will-change: margin-left;
}
</style>

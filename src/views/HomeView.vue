<script setup lang="ts">
import { ref } from 'vue';
import { mockParties } from '../mocks/partyData';

// Use Mock Data
const parties = ref(mockParties);
</script>

<template>
  <div class="space-y-4">
    <!-- Filter Bar -->
    <div class="bg-white p-2 rounded border border-gray-200 shadow-sm flex gap-2 overflow-x-auto no-scrollbar mb-4
                dark:bg-[var(--color-reddit-card)] dark:border-[var(--color-reddit-border)]">
        <button class="btn bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm rounded-full whitespace-nowrap px-4 border-none shadow-none
                       dark:bg-[#272729] dark:text-[#D7DADC] dark:hover:bg-[#333335]">
            🔥 인기순
        </button>
        <button class="btn hover:bg-gray-100 text-gray-600 text-sm rounded-full whitespace-nowrap px-4 border-none shadow-none
                       dark:text-[#818384] dark:hover:bg-[#272729]">
            ✨ 최신순
        </button>
        <div class="h-6 w-px bg-gray-300 mx-1 self-center dark:bg-[#343536]"></div>
         <button class="btn hover:bg-gray-100 text-gray-600 text-sm rounded-full whitespace-nowrap px-4 border-none shadow-none
                        dark:text-[#818384] dark:hover:bg-[#272729]">
            🗺️ 서울
        </button>
    </div>

    <!-- Party Feed Items -->
    <div v-for="party in parties" :key="party.partyId" 
         class="card card-hover flex overflow-hidden group mb-3">
        
        <!-- Upvote Sidebar -->
        <div class="w-10 bg-gray-50/50 border-r border-gray-100 flex flex-col items-center py-3 gap-1 
                    dark:bg-[#152025] dark:border-[#343536]">
            <button class="text-gray-400 hover:text-orange-500 p-1 rounded transition-colors
                           dark:hover:bg-[#272729]">▲</button>
            <span class="text-xs font-bold text-gray-700 dark:text-[#D7DADC]">12</span>
            <button class="text-gray-400 hover:text-blue-500 p-1 rounded transition-colors
                           dark:hover:bg-[#272729]">▼</button>
        </div>
        
        <!-- Content -->
        <div class="p-3 pl-4 flex-1">
            <div class="flex items-center gap-2 text-xs text-gray-500 mb-2 dark:text-[#818384]">
                <span class="font-bold text-gray-900 hover:underline dark:text-[#D7DADC]">{{ party.leaderNickname }}</span>
                <span>•</span>
                <span>{{ party.createdAt }}</span>
                <span>•</span>
                <span class="badge badge-primary">{{ party.region }}</span>
            </div>
            
            <h3 class="text-lg font-medium text-gray-900 mb-3 group-hover:text-blue-600 transition-colors
                       dark:text-[#D7DADC] dark:group-hover:text-blue-400">
                {{ party.title }}
            </h3>
            
            <div class="flex flex-wrap gap-2 mb-3">
                    <span v-for="slot in party.slots" :key="slot.slotId" 
                    class="badge border"
                    :class="slot.status === 'OPEN' 
                        ? 'bg-green-50 border-green-200 text-green-700 dark:bg-transparent dark:border-[#343536] dark:text-[#46D160]' 
                        : 'bg-gray-100 border-gray-200 text-gray-400 line-through dark:bg-transparent dark:border-transparent dark:text-[#5d5e5f]'"
                    >
                    {{ slot.position }}
                    </span>
            </div>
            
            <div class="flex gap-1 text-gray-500 text-xs font-bold dark:text-[#818384]">
                <button class="flex items-center gap-1 hover:bg-gray-100 px-2 py-2 rounded transition-colors dark:hover:bg-[#272729]">
                    <span>💬</span> 4 댓글
                </button>
                <button class="flex items-center gap-1 hover:bg-gray-100 px-2 py-2 rounded transition-colors dark:hover:bg-[#272729]">
                    <span>↗️</span> 공유
                </button>
                <button class="flex items-center gap-1 hover:bg-gray-100 px-2 py-2 rounded transition-colors dark:hover:bg-[#272729]">
                    <span>🔖</span> 저장
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

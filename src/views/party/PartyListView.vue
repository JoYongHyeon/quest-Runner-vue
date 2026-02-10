<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { partyApi } from '../../api/partyApi';
import type { Party, PartySearchCondition, PartySlot } from '../../types/Party';
import { formatDateTime } from '../../utils/dateUtils';

const router = useRouter();
const parties = ref<Party[]>([]);
const isLoading = ref(false);

const fetchParties = async () => {
    try {
        isLoading.value = true;
        const condition: PartySearchCondition = { page: 0, size: 10 };
        const res = await partyApi.getPartyList(condition);
        parties.value = res.content;
    } catch (e) {
        console.error(e);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchParties();
});

const goToDetail = (partyId: number) => {
    router.push(`/party/${partyId}`);
};

const getRecruitStatus = (slots: PartySlot[]) => {
    const total = slots.length;
    const filled = slots.filter(s => s.status !== 'OPEN').length; 
    return `(${filled}/${total})`;
};
</script>

<template>
  <div class="space-y-0">
    
    <!-- Filter Bar (패딩 조정: px-4) -->
    <div class="flex items-center gap-1.5 px-4 py-2 border-b border-gray-200 dark:border-[#343536]">
        
        <!-- Sort: Best -->
        <button class="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#272729] transition-colors group">
            <span class="text-sm font-bold text-gray-700 dark:text-[#D7DADC] group-hover:text-black dark:group-hover:text-white">Best</span>
            <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        <!-- Sort: Hot -->
        <button class="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#272729] transition-colors group">
            <span class="text-sm font-bold text-gray-500 dark:text-[#818384] group-hover:text-black dark:group-hover:text-white">Hot</span>
        </button>

        <!-- Sort: New -->
        <button class="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#272729] transition-colors group">
            <span class="text-sm font-bold text-gray-500 dark:text-[#818384] group-hover:text-black dark:group-hover:text-white">New</span>
        </button>

        <!-- Sort: Top -->
        <button class="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#272729] transition-colors group">
            <span class="text-sm font-bold text-gray-500 dark:text-[#818384] group-hover:text-black dark:group-hover:text-white">Top</span>
        </button>
        
        <div class="flex-1"></div>

        <!-- View Mode -->
        <button class="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 dark:hover:bg-[#272729] transition-colors">
            <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
        </button>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="text-center py-20 text-gray-500 dark:text-[#818384]">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mx-auto mb-2"></div>
        모험을 불러오는 중... ⚔️
    </div>

    <!-- 데이터 없음 -->
    <div v-else-if="parties.length === 0" class="text-center py-20 text-gray-500 dark:text-[#818384]">
        아직 등록된 퀘스트가 없습니다.
    </div>

    <!-- Party Feed Items (패딩 조정: px-4, py-3) -->
    <div v-else v-for="party in parties" :key="party.partyId" 
         @click="goToDetail(party.partyId)"
         class="group relative px-4 py-3 cursor-pointer transition-colors border-b border-gray-200 dark:border-[#343536] 
                hover:bg-gray-50 dark:hover:bg-[#1A282D]">
        
        <!-- Content -->
        <div class="flex flex-col gap-1">
            <!-- Meta Info -->
            <div class="flex items-center gap-2 text-[11px] text-gray-500 dark:text-[#818384]">
                <span class="font-bold text-black hover:underline dark:text-[#D7DADC]">{{ party.leaderNickname }}</span>
                <span>•</span>
                <span>{{ formatDateTime(party.createdAt) }}</span>
                <span>•</span>
            </div>
            
            <!-- Title -->
            <h3 class="text-base font-medium text-gray-900 leading-snug group-hover:text-blue-600 transition-colors my-0.5
                       dark:text-[#D7DADC] dark:group-hover:text-blue-400 flex items-center gap-2">
                {{ party.title }}
                <span class="text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                    {{ getRecruitStatus(party.slots) }}
                </span>
            </h3>
            
            <!-- Slots -->
            <div class="flex flex-wrap gap-1 mb-1">
                <span v-for="slot in party.slots" :key="slot.slotId" 
                      class="text-[10px] px-1.5 py-0.5 rounded-full border font-medium tracking-wide"
                      :class="slot.status === 'OPEN' 
                          ? 'border-green-200 text-green-700 bg-green-50 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400' 
                          : 'border-gray-200 text-gray-400 bg-gray-50 line-through dark:border-gray-700 dark:bg-transparent dark:text-gray-600'">
                    {{ slot.position }}
                </span>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-1 text-[11px] font-bold text-gray-500 dark:text-[#818384]">
                <button class="flex items-center gap-1 hover:bg-gray-200/50 px-2 py-1 rounded transition-colors dark:hover:bg-[#272729]">
                    <span class="text-xs">💬</span> 0 Comments
                </button>
                <button class="flex items-center gap-1 hover:bg-gray-200/50 px-2 py-1 rounded transition-colors dark:hover:bg-[#272729]">
                    <span class="text-xs">↗️</span> Share
                </button>
                <button class="flex items-center gap-1 hover:bg-gray-200/50 px-2 py-1 rounded transition-colors dark:hover:bg-[#272729]">
                    <span class="text-xs">🔖</span> Save
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

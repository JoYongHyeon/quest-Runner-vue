<script setup lang="ts">
import type { SlotDetailDTO, MatchedMemberDTO } from '../../../../api/partyApi';

/**
 * PartySlotList.vue
 * - 파티의 모집 현황(슬롯)을 그리드로 보여주는 공통 컴포넌트입니다.
 * - OPEN 상태: 기술 스택을 보여줍니다.
 * - LOCKED 상태: 매칭된 유저 정보를 보여주고, 클릭 시 프로필 모달을 요청합니다.
 */

defineProps<{
  slots: SlotDetailDTO[];
  leaderNickname: string;
  selectedSlotId?: number | null;
}>();

const emit = defineEmits<{
  (e: 'select', slot: SlotDetailDTO): void;
  (e: 'showProfile', member: MatchedMemberDTO): void;
}>();

const handleClick = (slot: SlotDetailDTO) => {
    // 1. 모집 중일 때: 슬롯 선택 (지원자용)
    if (slot.status === 'OPEN') {
        emit('select', slot);
    } 
    // 2. 모집 완료일 때: 멤버 프로필 보기 (누구나)
    else if (slot.status === 'LOCKED' && slot.matchedMember) {
        emit('showProfile', slot.matchedMember);
    }
};
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
    
    <!-- 1. Leader Slot (Fixed) -->
    <div class="bg-yellow-50 border border-yellow-200 h-40 flex flex-col items-center justify-center p-4 rounded-lg text-center shadow-sm select-none cursor-default
                dark:bg-yellow-900/20 dark:border-yellow-700">
        <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl mb-2 border border-yellow-200 dark:bg-yellow-800 dark:border-yellow-600">
            👑
        </div>
        <div class="text-sm font-bold text-gray-900 truncate w-full mb-1 dark:text-gray-200">{{ leaderNickname }}</div>
        <span class="px-2 py-0.5 text-[10px] font-bold bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-900 dark:text-yellow-300">LEADER</span>
    </div>

    <!-- 2. Slots -->
    <div v-for="slot in slots" :key="slot.slotId"
         @click="handleClick(slot)"
         class="h-40 flex flex-col items-center justify-center p-2 rounded-lg text-center transition-all relative select-none border"
         :class="[
            slot.status === 'OPEN'
                ? (selectedSlotId === slot.slotId
                    ? 'bg-blue-50 border-blue-500 shadow-md scale-105 cursor-pointer dark:bg-blue-900/30 dark:border-blue-400'
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer dark:bg-[#272729] dark:border-[#343536] dark:hover:border-gray-500')
                : 'bg-white border-green-200 cursor-pointer hover:border-green-400 hover:shadow-sm dark:bg-[#202022] dark:border-green-900'
         ]">
      
      <!-- Case A: 모집 중 (OPEN) -->
      <template v-if="slot.status === 'OPEN'">
        <div class="text-xs font-bold text-blue-600 mb-1 dark:text-blue-400">RECRUITING</div>
        <div class="px-2 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded mb-2 dark:bg-[#343536] dark:text-gray-300">
          {{ slot.position }}
        </div>
        
        <!-- 기술 스택 뱃지 -->
        <div class="flex flex-wrap justify-center gap-1 w-full overflow-hidden">
            <span v-for="tech in slot.techStacks" :key="tech"
                  class="text-[9px] px-1.5 py-0.5 bg-white border border-blue-100 text-blue-500 rounded dark:bg-[#272729] dark:border-[#555] dark:text-blue-300 whitespace-nowrap">
                {{ tech }}
            </span>
            <span v-if="slot.techStacks.length === 0" class="text-[9px] text-gray-400">(스택 무관)</span>
        </div>
      </template>

      <!-- Case B: 모집 완료 (LOCKED / FILLED) -->
      <template v-else>
        <!-- 프로필 아이콘 (이니셜) -->
        <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2 font-bold text-lg dark:bg-green-900/30 dark:text-green-400 border border-green-200">
            {{ slot.matchedMember?.nickname?.substring(0, 1) || '?' }}
        </div>
        
        <!-- 닉네임 -->
        <div class="text-xs font-bold text-gray-900 mb-1 truncate w-full px-2 dark:text-gray-200">
            {{ slot.matchedMember?.nickname || 'Unknown' }}
        </div>
        
        <!-- 포지션 -->
        <div class="px-2 py-0.5 text-[10px] font-bold bg-green-50 text-green-700 rounded border border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
          {{ slot.position }}
        </div>
      </template>
    </div>
  </div>
</template>
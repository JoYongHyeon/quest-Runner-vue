<script setup lang="ts">
import type { SlotDetailDTO, MatchedMemberDTO } from '../../../../api/partyApi';

/**
 * PartySlotList.vue
 * - 파티의 모집 현황(슬롯)을 그리드로 보여주는 공통 컴포넌트입니다.
 * - @vue3_prompt.md 준수: props 선언과 로직 내 접근 규격을 정확히 일치시킴.
 */

// 1. defineProps 를 props 변수로 할당 (스크립트 내 접근을 위해 필수)
const props = defineProps<{
  slots: SlotDetailDTO[];
  leaderNickname: string;
  selectedSlotId?: number | null;
  /** 종료 또는 취소 여부 (인터랙션 차단용) */
  isClosed?: boolean;
  /** 현재 유저가 파티장인지 여부 (원스톱 관리용) */
  isLeader?: boolean; 
}>();

const emit = defineEmits<{
  (e: 'select', slotId: number): void;
  (e: 'showProfile', member: MatchedMemberDTO): void;
  /** [NEW] 리더가 지원자 명단을 보려 할 때 발생 */
  (e: 'manageApplicants', slot: SlotDetailDTO): void;
}>();

/**
 * 슬롯 클릭 핸들러
 */
const handleClick = (slot: SlotDetailDTO) => {
    // [Guard] 파티가 종료/취소 상태면 모든 클릭 무력화 (정보 보호)
    if (props.isClosed) {
        console.warn('종료된 파티의 슬롯은 선택할 수 없습니다.');
        return;
    }

    // 1. 파티장(Leader)인 경우의 동작
    if (props.isLeader) {
        if (slot.status === 'OPEN') {
            // 모집 중인 슬롯 클릭 시 지원자 관리 모달 요청
            emit('manageApplicants', slot);
        } else if (slot.status === 'LOCKED' && slot.matchedMember) {
            // 확정된 멤버 클릭 시 프로필 보기
            emit('showProfile', slot.matchedMember);
        }
        return;
    }

    // 2. 일반 유저(Guest/Member)인 경우의 동작
    if (slot.status === 'OPEN') {
        // 모집 중인 슬롯 선택 (지원하기용)
        emit('select', slot.slotId);
    } 
    else if (slot.status === 'LOCKED' && slot.matchedMember) {
        // 확정된 멤버 프로필 보기
        emit('showProfile', slot.matchedMember);
    }
};
</script>

<template>
  <!-- [isClosed] 상태일 때 전체 리스트에 비활성 커서 적용 -->
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8"
       :class="{ 'cursor-not-allowed': props.isClosed }">
    
    <!-- 1. Leader Slot (상태에 따른 Grayscale 처리) -->
    <div class="bg-yellow-50 border border-yellow-200 h-40 flex flex-col items-center justify-center p-4 rounded-lg text-center shadow-sm select-none cursor-default
                dark:bg-yellow-900/20 dark:border-yellow-700"
         :class="{ 'grayscale opacity-70 border-gray-300': props.isClosed }">
        <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl mb-2 border border-yellow-200 dark:bg-yellow-800 dark:border-yellow-600 shadow-inner">
            👑
        </div>
        <div class="text-sm font-bold text-gray-900 truncate w-full mb-1 dark:text-gray-200">{{ leaderNickname }}</div>
        <span class="px-2 py-0.5 text-[10px] font-bold bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-900 dark:text-yellow-300">LEADER</span>
    </div>

    <!-- 2. Slots (RECRUITING & LOCKED) -->
    <div v-for="slot in slots" :key="slot.slotId"
         @click="handleClick(slot)"
         class="h-40 flex flex-col items-center justify-center p-2 rounded-lg text-center transition-all relative select-none border group"
         :class="[
            props.isClosed 
                ? 'bg-gray-50 border-gray-200 grayscale opacity-60 dark:bg-[#202022] dark:border-[#333]' 
                : (slot.status === 'OPEN'
                    ? (selectedSlotId === slot.slotId
                        ? 'bg-blue-50 border-blue-500 shadow-md scale-105 ring-2 ring-blue-200 cursor-pointer dark:bg-blue-900/30 dark:border-blue-400'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer dark:bg-[#272729] dark:border-[#343536] dark:hover:border-gray-500')
                    : 'bg-white border-green-200 cursor-pointer hover:border-green-400 hover:shadow-sm dark:bg-[#202022] dark:border-green-900')
         ]">
      
      <!-- [NEW] 지원자 수 숫자 배지 (리더 & OPEN 상태일 때만 노출) -->
      <div v-if="isLeader && slot.status === 'OPEN' && slot.applicants?.length" 
           class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md z-20 animate-bounce">
        {{ slot.applicants.length }}
      </div>

      <!-- Case A: 모집 중 (OPEN) -->
      <template v-if="slot.status === 'OPEN'">
        <div class="text-[10px] font-bold text-blue-600 mb-1 dark:text-blue-400 uppercase tracking-tighter">Recruiting</div>
        <div class="px-2 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded mb-2 dark:bg-[#343536] dark:text-gray-300">
          {{ slot.position }}
        </div>
        
        <!-- 기술 스택 뱃지 -->
        <div class="flex flex-wrap justify-center gap-1 w-full overflow-hidden px-1">
            <span v-for="tech in slot.techStacks" :key="tech"
                  class="text-[9px] px-1.5 py-0.5 bg-white border border-blue-100 text-blue-500 rounded dark:bg-[#272729] dark:border-[#555] dark:text-blue-300 whitespace-nowrap">
                {{ tech }}
            </span>
            <span v-if="slot.techStacks.length === 0" class="text-[9px] text-gray-400">(스택 무관)</span>
        </div>
      </template>

      <!-- Case B: 모집 완료 (LOCKED) -->
      <template v-else>
        <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2 font-bold text-lg dark:bg-green-900/30 dark:text-green-400 border border-green-200 shadow-sm">
            {{ slot.matchedMember?.nickname?.substring(0, 1) || '?' }}
        </div>
        <div class="text-xs font-bold text-gray-900 mb-1 truncate w-full px-2 dark:text-gray-200">
            {{ slot.matchedMember?.nickname || 'Unknown' }}
        </div>
        <div class="px-2 py-0.5 text-[10px] font-bold bg-green-50 text-green-700 rounded border border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
          {{ slot.position }}
        </div>
      </template>
    </div>
  </div>
</template>

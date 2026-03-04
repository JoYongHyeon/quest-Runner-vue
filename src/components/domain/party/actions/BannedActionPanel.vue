<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { PartyDetailResDTO } from '../../../../api/partyApi';

/**
 * BannedActionPanel.vue
 * - [상태: REJECTED | KICKED | QUIT]
 * - 재지원 불가 안내 및 뒤로가기 동선 제공
 */

defineProps<{
  party: PartyDetailResDTO;
}>();

const router = useRouter();

const getReasonText = (status?: string) => {
    switch(status) {
        case 'REJECTED': return '파티장에 의해 거절되었습니다.';
        case 'KICKED': return '파티에서 추방되었습니다.';
        case 'QUIT': return '이전에 중도 탈퇴한 이력이 있습니다.';
        default: return '지원할 수 없는 상태입니다.';
    }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-2xl dark:bg-[#202022] dark:border-[#343536] text-center">
    <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-4 dark:bg-red-900/20">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
    </div>
    <h3 class="text-lg font-black text-gray-900 dark:text-[#D7DADC] mb-2 tracking-tight">지원할 수 없는 퀘스트입니다.</h3>
    <p class="text-sm text-red-500 font-bold mb-8">
        사유: {{ getReasonText(party.myApplicantStatus) }}
    </p>
    
    <div class="flex gap-3 w-full sm:w-auto">
        <button @click="router.push('/my-party?tab=APPLIED')" 
                class="flex-1 sm:flex-none px-6 py-3 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-all shadow-md text-sm">
            내 활동 목록으로
        </button>
        <button @click="router.push('/')" 
                class="flex-1 sm:flex-none px-6 py-3 bg-white border border-gray-300 text-gray-700 font-black rounded-xl hover:bg-gray-50 transition-all text-sm dark:bg-[#272729] dark:border-[#555] dark:text-[#D7DADC] dark:hover:bg-[#343536]">
            다른 퀘스트 찾기
        </button>
    </div>
  </div>
</template>

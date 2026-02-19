<script setup lang="ts">
import type { PartyDetailResDTO } from '../../../../api/partyApi';

/**
 * BannedActionPanel.vue
 * - [상태: REJECTED | KICKED | QUIT]
 * - 재지원 불가 안내
 */

defineProps<{
  party: PartyDetailResDTO;
}>();

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
  <div class="flex flex-col items-center justify-center p-8 bg-gray-100 border-4 border-black dark:bg-[#202022] dark:border-[#343536] text-center opacity-80">
    <div class="text-4xl mb-3">🚫</div>
    <h3 class="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">지원할 수 없는 파티입니다.</h3>
    <p class="text-sm text-red-500 font-bold mb-6">
        사유: {{ getReasonText(party.myApplicantStatus) }}
    </p>
    
    <button @click="$router.push('/')" class="btn btn-primary text-sm">
        다른 파티 찾기
    </button>
  </div>
</template>
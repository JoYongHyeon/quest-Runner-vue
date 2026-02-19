<script setup lang="ts">
import { useRouter } from 'vue-router';

/**
 * PendingActionPanel.vue
 * - [상태: PENDING]
 * - 승인 대기 안내 및 취소 유도
 */

const router = useRouter();

const goToMyParty = () => {
    router.push('/my-party?tab=APPLIED');
};
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 bg-yellow-50 border-4 border-black dark:bg-[#202022] dark:border-[#343536] text-center">
    <div class="text-4xl mb-3">⏳</div>
    <h3 class="text-lg font-bold text-yellow-700 dark:text-yellow-400 mb-2">승인 대기 중입니다.</h3>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
        파티장의 수락을 기다리고 있습니다.<br>
        알림이 올 때까지 잠시만 기다려주세요!
    </p>
    
    <div class="flex gap-3">
        <button @click="$router.push('/')" class="btn bg-white border border-gray-300 hover:bg-gray-50 text-sm dark:bg-[#343536] dark:border-[#555] dark:text-[#D7DADC] dark:hover:bg-[#404142]">
            다른 파티 구경하기
        </button>
        <button @click="goToMyParty" class="btn bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm dark:bg-[#343536] dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20">
            지원 취소하러 가기
        </button>
    </div>
  </div>
</template>
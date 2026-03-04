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
  <div class="flex flex-col sm:flex-row items-center justify-between p-6 bg-yellow-50/50 border border-yellow-200 rounded-2xl dark:bg-yellow-900/10 dark:border-yellow-900/30 gap-4">
    
    <!-- 좌측 텍스트 -->
    <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-2xl shadow-sm dark:bg-yellow-900/30">
            ⏳
        </div>
        <div>
            <h3 class="text-lg font-black text-yellow-800 dark:text-yellow-500 tracking-tight">승인 대기 중입니다</h3>
            <p class="text-xs text-yellow-700/70 dark:text-yellow-400/70 font-bold mt-1">
                파티장의 수락을 기다리고 있습니다. 알림을 기다려주세요!
            </p>
        </div>
    </div>
    
    <!-- 우측 버튼 -->
    <div class="flex gap-3 w-full sm:w-auto">
        <button @click="goToMyParty" 
                class="flex-1 sm:flex-none px-6 py-3 bg-white border border-yellow-300 text-yellow-700 font-black rounded-xl hover:bg-yellow-100 transition-all text-sm shadow-sm dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-900/40">
            내 활동 목록으로
        </button>
        <button @click="router.push('/')" 
                class="flex-1 sm:flex-none px-6 py-3 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-all text-sm shadow-md">
            다른 파티 구경하기
        </button>
    </div>
  </div>
</template>
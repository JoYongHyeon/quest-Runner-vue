<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { PartyDetailResDTO } from '../../../../api/partyApi';

defineProps<{
  party: PartyDetailResDTO;
}>();

const router = useRouter();
</script>

<template>
  <div class="flex flex-col gap-4 p-4 bg-yellow-50 border-4 border-black dark:bg-[#202022] dark:border-[#343536]">
    <div class="font-bold text-center mb-2 dark:text-[#D7DADC]">파티장 메뉴</div>
    
    <div class="grid grid-cols-2 gap-4">
      <button @click="router.push('/my-party')" 
              class="btn bg-white border border-gray-300 hover:bg-gray-100 dark:bg-[#343536] dark:border-[#555] dark:text-[#D7DADC] dark:hover:bg-[#404142]">
        지원자 관리
      </button>
      <button @click="router.push(`/party/${party.partyId}/edit`)" 
              class="btn bg-white border border-gray-300 hover:bg-gray-100 dark:bg-[#343536] dark:border-[#555] dark:text-[#D7DADC] dark:hover:bg-[#404142]">
        파티 수정
      </button>
    </div>
    
    <button @click="$router.push('/')" class="w-full btn bg-gray-200 hover:bg-gray-300 dark:bg-[#272729] dark:text-[#D7DADC] dark:hover:bg-[#333]">
      목록으로 돌아가기
    </button>
  </div>
</template>

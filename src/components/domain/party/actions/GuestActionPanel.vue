<script setup lang="ts">
import { ref } from 'vue';
import { partyApi, type PartyApplyReqDTO, type PartyDetailResDTO } from '../../../../api/partyApi';
import { useAuth } from '../../../../composables/useAuth';

const props = defineProps<{
  party: PartyDetailResDTO;
  selectedSlotId: number | null;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const { requireOnboarding } = useAuth();
const applyMessage = ref('');

const handleApply = async () => {
  if (!requireOnboarding()) return;
  if (!props.selectedSlotId) {
    alert('지원할 포지션(슬롯)을 먼저 선택해주세요! 🛡️');
    return;
  }
  if (!applyMessage.value.trim()) {
    alert('파티장에게 보낼 한마디를 입력해주세요!');
    return;
  }

  try {
    const req: PartyApplyReqDTO = {
      slotId: props.selectedSlotId,
      message: applyMessage.value
    };
    await partyApi.applyParty(req);
    alert('지원이 완료되었습니다! 파티장의 수락을 기다려주세요. 🙏');
    
    // 페이지 새로고침 대신 부모에게 데이터 갱신 요청
    emit('refresh');
    
  } catch (e: any) {
    console.error(e);
    alert(e.response?.data?.message || '지원에 실패했습니다.');
  }
};
</script>

<template>
  <div class="flex flex-col md:flex-row gap-6 h-auto">
    
    <!-- 1. 메시지 표시/입력 영역 -->
    <div class="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-6 dark:bg-[#202022] dark:border-[#343536]">
        
        <!-- Case A: 슬롯 미선택 (파티 설명) -->
        <template v-if="!selectedSlotId">
            <div class="flex items-center gap-2 mb-4">
                <span class="text-sm font-bold text-gray-900 dark:text-[#D7DADC]">파티장 메시지</span>
                <span class="text-xs text-gray-500">From. {{ party.leaderNickname }}</span>
            </div>
            <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap dark:text-gray-300">{{ party.content }}</p>
            
            <div class="mt-6 flex items-center gap-2 text-sm text-blue-600 font-medium animate-pulse dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                </svg>
                위 목록에서 지원할 포지션(슬롯)을 선택해주세요.
            </div>
        </template>

        <!-- Case B: 슬롯 선택 (지원 폼) -->
        <div v-else class="flex flex-col h-full">
            <label class="block text-sm font-bold text-gray-700 mb-2 dark:text-[#D7DADC]">
                지원 메시지 작성 <span class="text-red-500">*</span>
            </label>
            <textarea v-model="applyMessage" 
                      class="w-full flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm transition-colors
                             dark:bg-[#272729] dark:border-[#555] dark:text-white dark:focus:ring-blue-600"
                      placeholder="자기소개나 각오를 간단히 적어주세요 (100자 이내)"></textarea>
            <p class="text-right text-xs text-gray-400 mt-1">{{ applyMessage.length }} / 100</p>
        </div>
    </div>
    
    <!-- 2. 액션 버튼 -->
    <div class="w-full md:w-1/3 flex flex-col gap-3">
        <button @click="handleApply"
                :disabled="!selectedSlotId"
                class="flex-1 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg shadow-md hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none
                       dark:bg-[#D93A00] dark:hover:bg-[#C83500]">
            파티 지원하기
        </button>
        <button @click="$router.push('/')"
                class="py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors
                       dark:bg-[#272729] dark:border-[#555] dark:text-[#D7DADC] dark:hover:bg-[#333]">
            목록으로
        </button>
    </div>
  </div>
</template>

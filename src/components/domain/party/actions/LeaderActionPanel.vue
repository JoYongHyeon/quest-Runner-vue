<script setup lang="ts">
import { useRouter } from 'vue-router';
import { partyApi, type PartyDetailResDTO } from '../../../../api/partyApi';

/**
 * LeaderActionPanel.vue
 * - 리더 전용 퀘스트 제어 센터
 * - [Update] 슬롯 중심 관리 도입에 따라 불필요한 관리 메뉴 버튼 제거
 */

const props = defineProps<{
  party: PartyDetailResDTO;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const router = useRouter();

/** 퀘스트 시작 [P-S006] */
const handleStartQuest = async () => {
  if (!window.confirm('퀘스트를 공식적으로 시작하시겠습니까?\n이후에는 새로운 지원자를 받을 수 없으며 협업 단계로 진입합니다.')) return;
  try {
    await partyApi.startQuest(props.party.partyId);
    alert('퀘스트가 시작되었습니다! 팀원들과 함께 멋진 결과를 만들어보세요.');
    emit('refresh');
  } catch (e: any) {
    alert(e.response?.data?.message || '시작 중 오류가 발생했습니다.');
  }
};

/** 프로젝트 성공 종료 [P-S007] */
const handleCompleteQuest = async () => {
  if (!window.confirm('축하합니다! 프로젝트를 완료 처리하시겠습니까?\n이 작업은 되돌릴 수 없으며 모든 멤버의 이력으로 기록됩니다.')) return;
  try {
    await partyApi.completeQuest(props.party.partyId);
    alert('고생하셨습니다! 퀘스트가 성공적으로 완료 처리되었습니다.');
    emit('refresh');
  } catch (e: any) {
    alert(e.response?.data?.message || '완료 처리 중 오류가 발생했습니다.');
  }
};

/** 모집 취소 [P-S005] */
const handleCancelParty = async () => {
  if (!window.confirm('정말로 모집을 중단하시겠습니까?\n취소된 파티는 복구할 수 없으며 파티장의 신뢰도에 영향을 줄 수 있습니다.')) return;
  try {
    await partyApi.cancelParty(props.party.partyId);
    alert('파티 모집이 취소되었습니다.');
    emit('refresh');
  } catch (e: any) {
    alert(e.response?.data?.message || '파티 취소 중 오류가 발생했습니다.');
  }
}
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between p-6 bg-gray-50 border border-gray-200 rounded-2xl dark:bg-[#202022] dark:border-[#343536] gap-4">
    
    <!-- 좌측 타이틀 영역 -->
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-xl shadow-sm dark:bg-yellow-900/30">
          👑
      </div>
      <div>
          <h3 class="font-black text-gray-900 dark:text-[#D7DADC]">파티 관리자 센터</h3>
          <p class="text-xs text-gray-500 font-bold dark:text-[#818384] mt-0.5">
              퀘스트의 여정을 제어할 수 있습니다.
          </p>
      </div>
    </div>

    <!-- 우측 여정 제어 및 목록 버튼 -->
    <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
      <!-- 여정 제어 버튼들 (상태에 따라 1개만 노출됨) -->
      <button v-if="party.status === 'RECRUITING'" @click="handleStartQuest" 
              class="px-5 py-2.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all text-sm shadow-md w-full sm:w-auto active:scale-95">
        퀘스트 시작하기
      </button>
      <button v-if="party.status === 'IN_PROGRESS'" @click="handleCompleteQuest" 
              class="px-5 py-2.5 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition-all text-sm shadow-md w-full sm:w-auto active:scale-95">
        성공적으로 완료
      </button>

      <!-- 상시 노출 관리 버튼 -->
      <button @click="router.push(`/party/${party.partyId}/edit`)" 
              class="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-black rounded-xl hover:bg-gray-50 transition-all text-sm w-full sm:w-auto dark:bg-[#272729] dark:border-[#555] dark:text-[#D7DADC] dark:hover:bg-[#343536] active:scale-95">
        정보 수정
      </button>
      <button @click="handleCancelParty" 
              class="px-4 py-2.5 bg-white border border-red-200 text-red-600 font-black rounded-xl hover:bg-red-50 transition-all text-sm w-full sm:w-auto dark:bg-[#272729] dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20 active:scale-95">
        모집 취소
      </button>
      <button @click="router.push('/my-party')" 
              class="px-4 py-2.5 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-all text-sm shadow-md w-full sm:w-auto active:scale-95">
        내 목록으로
      </button>
    </div>
  </div>
</template>

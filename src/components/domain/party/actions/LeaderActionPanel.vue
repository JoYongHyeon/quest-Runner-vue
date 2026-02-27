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
  <div class="flex flex-col gap-4 p-6 bg-yellow-50 border-4 border-black dark:bg-[#202022] dark:border-[#343536]">
    <div class="flex items-center justify-between mb-2">
      <div class="font-bold text-lg dark:text-[#D7DADC]">퀘스트 관리 센터</div>
      <span class="px-2 py-1 bg-yellow-200 text-yellow-800 text-[10px] font-bold rounded uppercase">Leader</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <!-- 1. 시작하기 -->
      <button v-if="party.status === 'RECRUITING'"
              @click="handleStartQuest"
              class="px-4 py-2.5 bg-blue-600 text-white rounded font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-700 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
        퀘스트 시작
      </button>

      <!-- 2. 완료하기 -->
      <button v-if="party.status === 'IN_PROGRESS'"
              @click="handleCompleteQuest"
              class="px-4 py-2.5 bg-green-600 text-white rounded font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-green-700 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
        완료(성공)
      </button>

      <!-- 3. 수정하기 -->
      <button @click="router.push(`/party/${party.partyId}/edit`)"
              class="px-4 py-2.5 bg-white border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all dark:bg-[#343536] dark:text-[#D7DADC]">
        정보 수정
      </button>

      <!-- 4. 취소하기 -->
      <button @click="handleCancelParty"
              class="px-4 py-2.5 bg-red-500 text-white rounded font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
        모집 취소
      </button>
    </div>

    <!-- [Simple] 내 활동 목록으로 돌아가기 버튼 하나로 통일 -->
    <button @click="router.push('/my-party')" 
            class="w-full py-3 mt-2 bg-white border-2 border-black font-bold hover:bg-gray-100 transition-all dark:bg-[#272729] dark:text-[#D7DADC]">
      내 활동 목록으로 돌아가기
    </button>
  </div>
</template>

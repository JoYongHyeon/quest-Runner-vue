<script setup lang="ts" xmlns:active="http://www.w3.org/1999/xhtml">
import {useRouter} from 'vue-router';
import {partyApi, type PartyDetailResDTO} from '../../../../api/partyApi';

/**
 * LeaderActionPanel.vue
 * - 리더 전용 퀘스트 제어 센터
 * - 퀘스트 시작, 성공 종료, 모집 취소 및 수정을 관리합니다.
 */

const props = defineProps<{
  party: PartyDetailResDTO;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void; // 상태 변경 후 화면 갱신을 위한 이벤트
}>();

const router = useRouter();

/**
 * 퀘스트를 공식적으로 시작합니다. [P-S006]
 * - 최소 1명 이상의 팀원이 확정된 상태여야 합니다.
 */
const handleStartQuest = async () => {
  if (!window.confirm('퀘스트를 공식적으로 시작하시겠습니까?\n이후에는 새로운 지원자를 받을 수 없으며 협업 단계로 진입합니다.')) {
    return;
  }

  try {
    await partyApi.startQuest(props.party.partyId);
    // [P-S006] 퀘스트가 성공적으로 시작되었습니다.
    alert('퀘스트가 시작되었습니다! 팀원들과 함께 멋진 결과를 만들어보세요.');
    emit('refresh');
  } catch (e: any) {
    console.error(e);
    alert(e.response?.data?.message || '시작 중 오류가 발생했습니다.');
  }
};

/**
 * 프로젝트를 성공적으로 완료(종료)합니다. [P-S007]
 */
const handleCompleteQuest = async () => {
  if (!window.confirm('축하합니다! 프로젝트가 성공적으로 끝났나요?\n완료 처리하면 모든 멤버의 이력에 성공 기록이 남으며, 더 이상 수정할 수 없습니다.')) {
    return;
  }

  try {
    await partyApi.completeQuest(props.party.partyId);
    alert('고생하셨습니다! 퀘스트가 성공적으로 완료 처리되었습니다.');
    emit('refresh');
  } catch (e: any) {
    console.error(e);
    alert(e.response?.data?.message || '완료 처리 중 오류가 발생했습니다.');
  }
};

/**
 * 파티 모집을 취소합니다. [P-S005]
 * - @PM_prompt.md 정책: 삭제가 아닌 CANCELED 상태 변경으로 이력 보존
 */
const handleCancelParty = async () => {
  if (!window.confirm('정말로 모집을 중단하시겠습니까?\n취소된 파티는 복구할 수 없으며, 파티장의 신뢰도에 영향을 미칠 수 있습니다.')) {
    return;
  }

  try {
    await partyApi.cancelParty(props.party.partyId);
    // [P-S005] 파티 모집이 취소되었습니다.
    alert('파티 모집이 취소되었습니다.');
    emit('refresh');

  } catch (e: any) {
    console.error(e);
    alert(e.response?.data?.message || '파티 취소 중 오류가 발생했습니다.');
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 p-6 bg-yellow-50 border-4 border-black dark:bg-[#202022] dark:border-[#343536]">
    <div class="flex items-center justify-between mb-2">
      <div class="font-bold text-lg dark:text-[#D7DADC]">파티 관리자 센터</div>
      <span class="px-2 py-1 bg-yellow-200 text-yellow-800 text-[10px] font-bold rounded uppercase dark:bg-yellow-900/30 dark:text-yellow-500">
        Leader
      </span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <!-- 1. 퀘스트 시작하기 (모집 중일 때만 노출) -->
      <button v-if="party.status === 'RECRUITING'"
              @click="handleStartQuest"
              class="px-4 py-2.5 bg-blue-600 text-white rounded font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-700 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
        퀘스트 시작
      </button>

      <!-- 2. 성공 종료 (진행 중일 때만 노출) -->
      <button v-if="party.status === 'IN_PROGRESS'"
              @click="handleCompleteQuest"
              class="px-4 py-2.5 bg-green-600 text-white rounded font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-green-700 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
        완료(성공)
      </button>

      <!-- 3. 파티 수정 -->
      <button @click="router.push(`/party/${party.partyId}/edit`)"
              class="px-4 py-2.5 bg-white border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all dark:bg-[#343536] dark:text-[#D7DADC]">
        퀘스트 수정
      </button>

      <!-- 4. 모집 취소 (실패) -->
      <button @click="handleCancelParty"
              class="px-4 py-2.5 bg-red-500 text-white rounded font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
        모집 취소(실패)
      </button>
    </div>

    <div class="grid grid-cols-1 gap-2 mt-2">
      <button @click="router.push('/my-party')"
              class="w-full py-2 bg-gray-100 border border-gray-300 rounded font-bold text-sm hover:bg-gray-200 dark:bg-[#272729] dark:border-[#555] dark:text-[#D7DADC]">
        전체 지원자 관리하기
      </button>
      <button @click="$router.push('/')" 
              class="w-full py-2 bg-white border border-gray-300 rounded font-bold text-sm hover:bg-gray-100 dark:bg-[#272729] dark:border-[#555] dark:text-[#D7DADC]">
        목록으로 돌아가기
      </button>
    </div>
  </div>
</template>

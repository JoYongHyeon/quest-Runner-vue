<script setup lang="ts">
import { useRouter } from 'vue-router';
import { partyApi, type PartyDetailResDTO } from '../../../../api/partyApi';
import { useAuth } from '../../../../composables/useAuth';

/**
 * MemberActionPanel.vue
 * - [Update] 상단에 작업 공간이 노출되므로, 하단 패널은 심플한 상태 안내와 '탈퇴/목록' 버튼만 유지합니다.
 */

const props = defineProps<{
  party: PartyDetailResDTO;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const router = useRouter();
const { currentUser } = useAuth();

// 현재 접속한 멤버의 applicantId 를 찾아 탈퇴 API 에 사용
const getMyApplicantId = () => {
    if (!currentUser.value) return null;
    const mySlot = props.party.slots.find(s => s.matchedMember?.memberId === currentUser.value?.id);
    return mySlot?.matchedMember?.applicantId;
};

const handleQuit = async () => {
    const applicantId = getMyApplicantId();
    if (!applicantId) {
        alert('지원 정보를 찾을 수 없습니다.');
        return;
    }

    if (!confirm('정말 퀘스트를 포기하고 탈퇴하시겠습니까?\n이 결정은 귀하의 평판(자진 탈퇴 이력)에 기록됩니다.')) return;

    try {
        await partyApi.quitParty(applicantId);
        alert('퀘스트에서 탈퇴하였습니다. 슬롯이 다시 열렸습니다.');
        emit('refresh'); 
    } catch (e: any) {
        alert(e.response?.data?.message || '탈퇴 처리에 실패했습니다.');
    }
};
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between p-6 bg-gray-50 border border-gray-200 rounded-2xl dark:bg-[#202022] dark:border-[#343536] gap-4">
    
    <!-- 좌측 상태 텍스트 -->
    <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl shadow-sm dark:bg-emerald-900/30">
            🎉
        </div>
        <div>
            <h3 class="font-black text-gray-900 dark:text-[#D7DADC]">환영합니다! 동료가 되셨군요.</h3>
            <p class="text-xs text-gray-500 font-bold dark:text-[#818384] mt-0.5">
                상단의 <span class="text-blue-600 dark:text-blue-400">팀원 전용 작업 공간</span>을 확인해 주세요.
            </p>
        </div>
    </div>

    <!-- 우측 심플 액션 버튼들 -->
    <div class="flex items-center gap-3 w-full sm:w-auto">
        <button @click="handleQuit" 
                class="px-5 py-2.5 bg-white border border-gray-300 text-gray-600 font-black rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-sm w-full sm:w-auto dark:bg-[#272729] dark:border-[#555] dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-800">
            퀘스트 하차하기
        </button>
        <button @click="router.push('/my-party?tab=APPLIED')" 
                class="px-6 py-2.5 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-all text-sm shadow-md w-full sm:w-auto">
            내 목록으로
        </button>
    </div>
  </div>
</template>

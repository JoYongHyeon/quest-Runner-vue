<script setup lang="ts">
import { partyApi, type SlotDetailDTO, type ApplicantDecisionReqDTO } from '../../../../api/partyApi';

/**
 * SlotApplicantsModal.vue
 * - 특정 슬롯에 지원한 유저들의 명단을 보여주고 수락/거절을 처리합니다.
 * - [Reputation] 서버에서 계산된 실제 평판 통계(성공/추방/진행중 등)를 화면에 바인딩합니다.
 * - @vue3_prompt.md 준수: 직관적인 한글 인터페이스 및 상세 주석 적용.
 */

const props = defineProps<{
  slot: SlotDetailDTO;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'refresh'): void;
}>();

/** 
 * 지원자 수락/거절 결정 처리 
 * [PATCH] /api/parties/applicants/{applicantId}
 */
const handleDecision = async (applicantId: number, status: 'ACCEPTED' | 'REJECTED') => {
    const actionText = status === 'ACCEPTED' ? '수락' : '거절';
    if (!confirm(`해당 지원자를 ${actionText}하시겠습니까?`)) return;

    try {
        const req: ApplicantDecisionReqDTO = { status };
        await partyApi.decideApplicant(applicantId, req);
        
        // [P-S003] 지원자 상태 변경 성공
        alert(`지원자를 성공적으로 ${actionText}했습니다.`);
        emit('refresh'); // 데이터 최신화 요청
    } catch (e: any) {
        console.error(e);
        alert(e.response?.data?.message || '처리에 실패했습니다.');
    }
};
</script>

<template>
  <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="emit('close')">
    <div class="bg-white dark:bg-[#1A282D] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-[#343536] transform transition-all scale-100">
        
        <!-- Header: 슬롯 정보 표시 -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 flex justify-between items-center text-white">
            <div>
                <h3 class="font-bold text-lg">지원 현황: {{ slot.position }}</h3>
                <p class="text-xs text-blue-100 opacity-80 font-medium">이 슬롯에 지원한 예비 동료들의 전적을 확인하세요.</p>
            </div>
            <button @click="emit('close')" class="p-2 hover:bg-white/20 rounded-full transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Applicant List: 평판 기반 지원자 카드 -->
        <div class="p-4 max-h-[60vh] overflow-y-auto space-y-4">
            <!-- 지원자 데이터 없음 -->
            <div v-if="!slot.applicants || slot.applicants.length === 0" class="text-center py-12">
                <div class="text-4xl mb-4 opacity-20 text-gray-400">🔍</div>
                <p class="text-gray-400 dark:text-gray-500 font-medium">아직 대기 중인 지원자가 없습니다.</p>
            </div>

            <!-- 지원자 루프 -->
            <div v-for="app in slot.applicants" :key="app.applicantId" 
                 class="group p-5 border rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all dark:bg-[#272729] dark:border-[#343536] dark:hover:bg-[#343536]">
                
                <div class="flex justify-between items-start mb-4">
                    <div class="min-w-0 flex-1">
                        <h4 class="font-black text-gray-900 dark:text-white flex items-center gap-2 truncate text-base mb-2">
                            {{ app.nickname }}
                        </h4>
                        
                        <!-- [NEW] 평판 스탯 섹션: 서버 실데이터 연결 -->
                        <div class="flex flex-wrap gap-2 mb-3">
                            <span class="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800">
                                완료 {{ app.completedCount }}회
                            </span>
                            <span class="px-2 py-0.5 text-[10px] font-black rounded border transition-colors"
                                  :class="app.kickedCount > 0 
                                    ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30' 
                                    : 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-800 dark:border-gray-700'">
                                추방 {{ app.kickedCount }}회
                            </span>
                            <span class="px-2 py-0.5 text-[10px] font-black rounded border"
                                  :class="app.activeQuestCount >= 2 
                                    ? 'bg-orange-50 text-orange-600 border-orange-200' 
                                    : 'bg-blue-50 text-blue-600 border-blue-100'">
                                진행 중 {{ app.activeQuestCount }}개
                            </span>
                        </div>

                        <!-- 링크 정보 -->
                        <div class="flex gap-3 text-[10px] font-black uppercase tracking-wider">
                            <a v-if="app.gitUrl" :href="app.gitUrl" target="_blank" class="text-blue-500 hover:text-blue-700 underline underline-offset-4">GitHub</a>
                            <a v-if="app.blogUrl" :href="app.blogUrl" target="_blank" class="text-orange-500 hover:text-orange-700 underline underline-offset-4">Tech Blog</a>
                        </div>
                    </div>

                    <!-- 액션 버튼 (PENDING 상태일 때만) -->
                    <div v-if="app.status === 'PENDING'" class="flex gap-2 shrink-0">
                        <button @click="handleDecision(app.applicantId, 'ACCEPTED')" 
                                class="px-4 py-2 bg-gray-900 text-white text-xs font-black rounded-xl hover:bg-black transition-all active:scale-90 shadow-md">
                            수락
                        </button>
                        <button @click="handleDecision(app.applicantId, 'REJECTED')" 
                                class="px-4 py-2 bg-white border-2 border-red-100 text-red-500 text-xs font-black rounded-xl hover:bg-red-50 transition-all active:scale-90">
                            거절
                        </button>
                    </div>
                </div>

                <!-- [NEW] 최근 추방 사유 노출 (데이터 기반 경고) -->
                <div v-if="app.lastKickedReason" class="mb-4 p-3 bg-red-50 rounded-xl border border-red-100 dark:bg-red-900/10 dark:border-red-900/30">
                    <div class="text-[10px] font-black text-red-600 uppercase mb-1 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                        최근 추방 사유
                    </div>
                    <p class="text-xs text-red-700 dark:text-red-400 font-bold leading-relaxed italic">"{{ app.lastKickedReason }}"</p>
                </div>

                <!-- 지원 메시지 -->
                <div class="bg-white dark:bg-[#1A282D] p-4 rounded-xl border border-gray-100 dark:border-gray-700 italic text-sm text-gray-600 dark:text-gray-400 leading-relaxed shadow-inner">
                    "{{ app.message }}"
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="p-4 bg-gray-50 dark:bg-[#202022] border-t border-gray-100 dark:border-[#343536] text-center">
            <button @click="emit('close')" class="text-[10px] font-black text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 uppercase tracking-[0.3em] transition-all">
                Close Applicant View
            </button>
        </div>
    </div>
  </div>
</template>

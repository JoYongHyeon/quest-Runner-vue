<script setup lang="ts">
import { ref, onMounted, computed, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { partyApi, type PartyDetailResDTO, type MatchedMemberDTO, type SlotDetailDTO, type PartyKickReqDTO } from '../../api/partyApi';
import { useAuth } from '../../composables/useAuth';

/**
 * PartyDetailView.vue
 * - [Update] 영문 라벨을 직관적인 한글(UX)로 변경.
 */

// --- Components (Lazy Load) ---
const PartySlotList = defineAsyncComponent(() => import('../../components/domain/party/common/PartySlotList.vue'));
const GuestActionPanel = defineAsyncComponent(() => import('../../components/domain/party/actions/GuestActionPanel.vue'));
const LeaderActionPanel = defineAsyncComponent(() => import('../../components/domain/party/actions/LeaderActionPanel.vue'));
const MemberActionPanel = defineAsyncComponent(() => import('../../components/domain/party/actions/MemberActionPanel.vue'));
const PendingActionPanel = defineAsyncComponent(() => import('../../components/domain/party/actions/PendingActionPanel.vue'));
const BannedActionPanel = defineAsyncComponent(() => import('../../components/domain/party/actions/BannedActionPanel.vue'));
const SlotApplicantsModal = defineAsyncComponent(() => import('../../components/domain/party/modals/SlotApplicantsModal.vue'));

const route = useRoute();
const router = useRouter();
const { currentUser } = useAuth();

// --- State (상태 관리) ---
const party = ref<PartyDetailResDTO | null>(null);
const isLoading = ref(true);
const selectedSlotId = ref<number | null>(null);
const selectedProfile = ref<MatchedMemberDTO | null>(null);
const managingSlot = ref<SlotDetailDTO | null>(null); 

const partyId = Number(route.params.id);

// --- Computed (계산된 속성) ---
const isLeader = computed(() => {
  return currentUser.value && party.value && currentUser.value.id === party.value.leaderId;
});

const myStatus = computed(() => party.value?.myApplicantStatus);

const isClosed = computed(() => ['CANCELED', 'COMPLETED'].includes(party.value?.status || ''));

const isInProgress = computed(() => party.value?.status === 'IN_PROGRESS');

const actionPanelComponent = computed(() => {
  if (isLeader.value) return LeaderActionPanel;
  if (myStatus.value === 'ACCEPTED') return MemberActionPanel;
  if (myStatus.value === 'PENDING') return PendingActionPanel;
  if (['REJECTED', 'KICKED', 'QUIT'].includes(myStatus.value || '')) return BannedActionPanel;
  return GuestActionPanel;
});

// 영문 Status 를 한글로 변환하는 헬퍼 함수
const getKoreanStatus = (status?: string) => {
    switch(status) {
        case 'RECRUITING': return '모집 중';
        case 'IN_PROGRESS': return '진행 중';
        case 'COMPLETED': return '완료됨';
        case 'CANCELED': return '취소됨';
        default: return '알 수 없음';
    }
};

// --- Methods ---
const fetchPartyDetail = async () => {
  try {
    if (!party.value) isLoading.value = true;
    party.value = await partyApi.getPartyDetail(partyId);
  } catch (e) {
    console.error(e);
    alert('존재하지 않거나 삭제된 파티입니다.');
    router.push('/');
  } finally {
    isLoading.value = false;
  }
};

const handleSlotSelect = (slotId: number) => {
  if (isLeader.value || myStatus.value || isClosed.value) return;
  selectedSlotId.value = selectedSlotId.value === slotId ? null : slotId;
};

const handleShowProfile = (member: MatchedMemberDTO) => {
    if (isClosed.value) return;
    selectedProfile.value = member;
};

const handleManageApplicants = (slot: SlotDetailDTO) => {
    managingSlot.value = slot;
};

const handleKickMember = async () => {
    const applicantId = selectedProfile.value?.applicantId;
    if (!applicantId) return;

    const nickname = selectedProfile.value?.nickname;
    const reason = prompt(`'${nickname}'님을 정말로 추방하시겠습니까?\n추방 사유를 입력해주세요 (필수):`);

    if (reason === null) return; 
    if (!reason.trim()) {
        alert('추방 사유는 필수 입력 사항입니다.');
        return;
    }

    try {
        const req: PartyKickReqDTO = { reason: reason };
        await partyApi.kickApplicant(applicantId, req);
        alert('추방 처리가 완료되었습니다. 해당 슬롯이 다시 모집 중으로 변경됩니다.');
        selectedProfile.value = null; 
        await fetchPartyDetail(); 
    } catch (e: any) {
        console.error(e);
        alert(e.response?.data?.message || '추방 처리 중 오류가 발생했습니다.');
    }
};

onMounted(fetchPartyDetail);
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4 font-sans">
    
    <!-- 1. 로딩 상태 -->
    <div v-if="isLoading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-500 font-bold dark:text-[#818384]">데이터를 불러오는 중입니다...</p>
    </div>

    <!-- 2. 메인 컨텐츠 -->
    <div v-else-if="party" class="bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden dark:bg-[#1A282D] dark:border-[#343536] transition-all duration-500">
      
      <!-- 상태 배너 (CANCELED / COMPLETED) -->
      <div v-if="party.status === 'CANCELED'" 
           class="bg-gradient-to-r from-red-600 to-red-700 p-4 text-white text-center font-black uppercase tracking-widest text-sm shadow-inner">
           모집 중단된 퀘스트
      </div>
      <div v-if="party.status === 'COMPLETED'" 
           class="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white text-center font-black uppercase tracking-widest text-sm shadow-inner">
           성공적으로 완료된 퀘스트
      </div>
      
      <!-- 진행 중 알림 배너 (한글화) -->
      <div v-if="isInProgress" 
           class="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white text-center font-black uppercase tracking-widest text-sm shadow-inner flex items-center justify-center gap-3">
          <span class="animate-pulse w-2 h-2 rounded-full bg-white"></span>
          여정 진행 중 (시작일: {{ party.startedAt?.split('T')[0] || '기록 없음' }})
      </div>

      <!-- 헤더 섹션 (한글화) -->
      <div class="px-10 py-10 border-b border-gray-100 bg-gray-50/30 dark:bg-[#202022] dark:border-[#343536]">
        <h2 class="text-4xl font-black text-gray-900 mb-3 dark:text-[#D7DADC] tracking-tighter">{{ party.title }}</h2>
        <div class="flex items-center gap-4 text-xs font-black text-gray-400 uppercase tracking-widest">
            <!-- [Fix] 영어 상태 대신 한글 상태 사용 -->
            <span class="px-3 py-1 rounded-lg" 
                  :class="isInProgress ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'">
                {{ getKoreanStatus(party.status) }}
            </span>
            <span class="text-gray-300">|</span>
            <span>생성일: {{ party.createdAt.split('T')[0] }}</span>
        </div>
      </div>

      <div class="p-10">
        
        <!-- 진행 중일 때 리더와 확정된 멤버에게만 보여주는 프라이빗 작업 공간 -->
        <div v-if="isInProgress && (isLeader || myStatus === 'ACCEPTED') && party.linkList?.length" 
             class="mb-10 p-6 bg-blue-50 border border-blue-100 rounded-2xl dark:bg-blue-900/10 dark:border-blue-900/30">
            <h3 class="text-sm font-black text-blue-800 uppercase tracking-widest mb-4 flex items-center gap-2 dark:text-blue-400">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                팀원 전용 작업 공간
            </h3>
            <div class="flex flex-wrap gap-3">
                <a v-for="link in party.linkList" :key="link.label" :href="link.url" target="_blank"
                   class="px-4 py-2 bg-white border border-blue-200 text-blue-700 font-bold rounded-xl hover:shadow-md hover:border-blue-400 transition-all dark:bg-[#1A282D] dark:border-blue-800/50 dark:text-blue-300 dark:hover:border-blue-500">
                    {{ link.label }} 바로가기 ↗
                </a>
            </div>
        </div>

        <!-- 슬롯 그리드 컴포넌트 (타이틀 한글화) -->
        <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 dark:text-[#818384]">현재 팀원 현황</h3>
        
        <PartySlotList 
            :slots="party.slots" 
            :leader-nickname="party.leaderNickname"
            :selected-slot-id="selectedSlotId" 
            :is-closed="isClosed"
            :is-leader="isLeader"
            @select="handleSlotSelect"
            @showProfile="handleShowProfile"
            @manageApplicants="handleManageApplicants"
        />

        <hr class="my-12 border-gray-100 dark:border-[#343536]">

        <!-- 하단 인터랙션 패널 (파티가 활성 상태일 때만) -->
        <component 
            v-if="!isClosed"
            :is="actionPanelComponent" 
            :party="party" 
            :selected-slot-id="selectedSlotId"
            @refresh="fetchPartyDetail"
        />

        <!-- 종료 안내 영역 (CANCELED / COMPLETED) -->
        <div v-else class="text-center py-16 bg-gray-50 rounded-[2.5rem] dark:bg-[#202022] border-2 border-dashed border-gray-200 dark:border-[#333]">
            <div class="text-6xl mb-6 grayscale">🏆</div>
            <p class="text-gray-500 dark:text-gray-400 font-black text-xl mb-8 tracking-tight">이미 여정이 끝난 퀘스트입니다.</p>
            <div class="flex items-center justify-center gap-4 flex-col sm:flex-row">
                <!-- [Fix] 리더면 만든 퀘스트 탭으로, 지원자면 지원한 퀘스트 탭으로 이동 -->
                <button @click="router.push(isLeader ? '/my-party' : '/my-party?tab=APPLIED')" 
                        class="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95 text-sm">
                    내 활동 목록으로
                </button>
                <button @click="router.push('/')" 
                        class="px-10 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-black hover:bg-gray-50 transition-all active:scale-95 text-sm dark:bg-[#272729] dark:border-[#555] dark:text-[#D7DADC] dark:hover:bg-[#343536]">
                    새로운 퀘스트 찾기
                </button>
            </div>
        </div>
      </div>
    </div>

    <!-- 3. [MODAL] 슬롯 관리 (리더 전용) -->
    <SlotApplicantsModal 
        v-if="managingSlot" 
        :slot="managingSlot" 
        @close="managingSlot = null"
        @refresh="fetchPartyDetail(); managingSlot = null;"
    />

    <!-- 4. [MODAL] 유저 프로필 및 추방 -->
    <div v-if="selectedProfile" class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" @click.self="selectedProfile = null">
        <!-- 기존 모달 내용 유지 ... -->
        <div class="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl max-w-sm w-full overflow-hidden border border-white/10 transform transition-all scale-100">
            <!-- Header -->
            <div class="bg-gradient-to-br from-indigo-600 to-blue-900 p-10 text-center relative">
                <button @click="selectedProfile = null" class="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div class="w-28 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] mx-auto flex items-center justify-center text-5xl mb-6 border border-white/20 shadow-2xl text-white font-black uppercase">
                    {{ selectedProfile.nickname.substring(0, 1) }}
                </div>
                <h3 class="text-3xl font-black text-white tracking-tighter">{{ selectedProfile.nickname }}</h3>
                <p class="text-blue-200 text-[10px] font-black mt-2 tracking-[0.4em] uppercase opacity-80">Quest Member</p>
            </div>

            <!-- Body -->
            <div class="p-10 space-y-4 bg-white dark:bg-gray-900">
                <a :href="selectedProfile.gitUrl || '#'" target="_blank" 
                   class="flex items-center p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group">
                    <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest flex-1 group-hover:text-blue-600 transition-colors">GitHub Repository</span>
                    <svg class="w-5 h-5 text-gray-300 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
                <a :href="selectedProfile.blogUrl || '#'" target="_blank" 
                   class="flex items-center p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group">
                    <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest flex-1 group-hover:text-orange-500 transition-colors">Technical Blog</span>
                    <svg class="w-5 h-5 text-gray-300 group-hover:text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
            </div>
            
            <!-- Footer (강제 추방 버튼) -->
            <div class="p-8 bg-gray-50 border-t border-gray-100 dark:bg-gray-800/50 dark:border-gray-700 flex flex-col gap-4">
                <button v-if="isLeader && !isClosed" 
                        @click="handleKickMember"
                        class="w-full py-4 bg-red-50 text-red-600 rounded-3xl font-black hover:bg-red-100 transition-all text-sm border border-red-100 shadow-sm active:scale-95 uppercase tracking-widest">
                    동료 강제 추방하기
                </button>
                <button @click="selectedProfile = null" 
                        class="w-full py-2 text-gray-400 font-bold hover:text-gray-600 transition-colors text-[10px] uppercase tracking-[0.5em]">
                    창 닫기
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

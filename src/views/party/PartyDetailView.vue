<script setup lang="ts">
import { ref, onMounted, computed, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { partyApi, type PartyDetailResDTO, type MatchedMemberDTO } from '../../api/partyApi';
import { useAuth } from '../../composables/useAuth';

// --- Components (Lazy Load) ---
const PartySlotList = defineAsyncComponent(() => import('../../components/domain/party/common/PartySlotList.vue'));
const GuestActionPanel = defineAsyncComponent(() => import('../../components/domain/party/actions/GuestActionPanel.vue'));
const LeaderActionPanel = defineAsyncComponent(() => import('../../components/domain/party/actions/LeaderActionPanel.vue'));
const MemberActionPanel = defineAsyncComponent(() => import('../../components/domain/party/actions/MemberActionPanel.vue'));
const PendingActionPanel = defineAsyncComponent(() => import('../../components/domain/party/actions/PendingActionPanel.vue'));
const BannedActionPanel = defineAsyncComponent(() => import('../../components/domain/party/actions/BannedActionPanel.vue'));

const route = useRoute();
const router = useRouter();
const { currentUser } = useAuth();

// --- State ---
const party = ref<PartyDetailResDTO | null>(null);
const isLoading = ref(true);
const selectedSlotId = ref<number | null>(null);

const partyId = Number(route.params.id);

// --- Computed Logic ---
const isLeader = computed(() => {
  return currentUser.value && party.value && currentUser.value.id === party.value.leaderId;
});

const myStatus = computed(() => party.value?.myApplicantStatus);

/**
 * 파티가 종료되거나 취소되었는지 여부
 * - @PM_prompt.md: 종료된 여정은 모든 인터랙션이 중단되어야 함
 */
const isClosed = computed(() => ['CANCELED', 'COMPLETED'].includes(party.value?.status || ''));

// 역할에 따라 보여줄 하단 액션 패널 결정
const actionPanelComponent = computed(() => {
  if (isLeader.value) return LeaderActionPanel;
  if (myStatus.value === 'ACCEPTED') return MemberActionPanel;
  if (myStatus.value === 'PENDING') return PendingActionPanel;
  if (['REJECTED', 'KICKED', 'QUIT'].includes(myStatus.value || '')) return BannedActionPanel;
  return GuestActionPanel;
});

// --- Methods ---
/**
 * 파티 상세 데이터를 서버에서 가져옵니다.
 */
const fetchPartyDetail = async () => {
  try {
    // 갱신 시 로딩바 표시 여부는 선택 사항 (여기선 조용히 갱신)
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

/**
 * 슬롯 클릭 시 선택 상태를 토글합니다.
 */
const handleSlotSelect = (slot: any) => {
  // [Guard] 리더이거나 이미 지원 상태가 있거나 파티가 닫혔으면 무시
  if (isLeader.value || myStatus.value || isClosed.value) return;
  if (slot.status !== 'OPEN') return;
  selectedSlotId.value = selectedSlotId.value === slot.slotId ? null : slot.slotId;
};

const selectedProfile = ref<MatchedMemberDTO | null>(null);

/**
 * 매칭된 멤버의 프로필 모달을 엽니다.
 */
const handleShowProfile = (member: MatchedMemberDTO) => {
    // [Guard] 파티가 닫혔으면 프로필 보기 차단 (정보 보호)
    if (isClosed.value) return;
    selectedProfile.value = member;
};

// --- Lifecycle ---
onMounted(fetchPartyDetail);
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-500 dark:text-[#818384]">던전 정보를 읽어오는 중...</p>
    </div>

    <!-- Main Content (Modern Card UI) -->
    <div v-else-if="party" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden dark:bg-[#1A282D] dark:border-[#343536]">
      
      <!-- 파티 취소 알림 배너 -->
      <div v-if="party.status === 'CANCELED'" 
           class="bg-red-600 p-4 text-white text-center font-bold flex items-center justify-center gap-2">
           <svg class="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
           </svg>
           본 퀘스트는 파티장의 사정으로 모집이 중단(취소)되었습니다.
      </div>

      <!-- [NEW] 완료 배너 -->
      <div v-if="party.status === 'COMPLETED'" 
           class="bg-green-600 p-4 text-white text-center font-bold flex items-center justify-center gap-2">
           <svg class="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           축하합니다! 본 퀘스트의 모든 여정이 성공적으로 완료되었습니다.
      </div>

      <!-- Header -->
      <div class="px-8 py-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center dark:bg-[#202022] dark:border-[#343536]">
        <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-1 dark:text-[#D7DADC]">{{ party.title }}</h2>
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-[#818384]">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {{ party.region || 'ONLINE' }}
                </span>
                <span>•</span>
                <span>Created at {{ party.createdAt.split('T')[0] }}</span>
            </div>
        </div>
      </div>

      <div class="p-8">
        
        <!-- Slot Grid -->
        <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 dark:text-[#818384]">Recruitment Status</h3>
        <PartySlotList 
            :slots="party.slots" 
            :leader-nickname="party.leaderNickname"
            :selected-slot-id="selectedSlotId" 
            :is-closed="isClosed"
            @select="handleSlotSelect"
            @showProfile="handleShowProfile"
        />

        <hr class="my-8 border-gray-100 dark:border-[#343536]">

        <!-- Action Panel (파티가 닫히지 않았을 때만 노출) -->
        <component 
            v-if="!isClosed"
            :is="actionPanelComponent" 
            :party="party" 
            :selected-slot-id="selectedSlotId"
            @refresh="fetchPartyDetail"
        />

        <!-- [NEW] 종료/취소된 파티일 경우 안내 문구 -->
        <div v-else class="text-center py-10 bg-gray-50 rounded-2xl dark:bg-[#202022] border border-gray-100 dark:border-[#333]">
            <p class="text-gray-500 dark:text-gray-400 font-medium">이미 종료된 퀘스트입니다. 다른 멋진 퀘스트를 찾아보세요!</p>
            <button @click="router.push('/')" class="mt-4 px-8 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg active:scale-95">
              다른 퀘스트 보러가기
            </button>
        </div>
      </div>
    </div>

    <!-- User Profile Modal -->
    <div v-if="selectedProfile" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="selectedProfile = null">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-gray-100 dark:border-gray-700 transform transition-all scale-100">
            <!-- Header -->
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-center relative">
                <button @click="selectedProfile = null" class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div class="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mx-auto flex items-center justify-center text-3xl mb-3 border-2 border-white/30 shadow-inner text-white font-bold">
                    {{ selectedProfile.nickname.substring(0, 1) }}
                </div>
                <h3 class="text-xl font-bold text-white tracking-wide">{{ selectedProfile.nickname }}</h3>
                <p class="text-blue-100 text-sm mt-1">Quest Runner Member</p>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-4">
                <!-- GitHub -->
                <a :href="selectedProfile.gitUrl || '#'" :target="selectedProfile.gitUrl ? '_blank' : ''" 
                   class="flex items-center p-3 rounded-xl transition-all group border"
                   :class="selectedProfile.gitUrl ? 'bg-gray-50 hover:bg-gray-100 border-gray-200 cursor-pointer dark:bg-gray-700/50 dark:hover:bg-gray-700 dark:border-gray-600' : 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700'">
                    <div class="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white shrink-0 mr-4 shadow-sm group-hover:scale-105 transition-transform">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="text-xs font-bold text-gray-500 uppercase dark:text-gray-400">GitHub</div>
                        <div class="text-sm font-medium text-gray-900 truncate dark:text-gray-200">{{ selectedProfile.gitUrl || 'Not Connected' }}</div>
                    </div>
                </a>

                <!-- Blog -->
                <a :href="selectedProfile.blogUrl || '#'" :target="selectedProfile.blogUrl ? '_blank' : ''"
                   class="flex items-center p-3 rounded-xl transition-all group border"
                   :class="selectedProfile.blogUrl ? 'bg-orange-50 hover:bg-orange-100 border-orange-200 cursor-pointer dark:bg-orange-900/10 dark:hover:bg-orange-900/20 dark:border-orange-800' : 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700'">
                    <div class="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white shrink-0 mr-4 shadow-sm group-hover:scale-105 transition-transform">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="text-xs font-bold text-orange-600 uppercase dark:text-orange-400">Tech Blog</div>
                        <div class="text-sm font-medium text-gray-900 truncate dark:text-gray-200">{{ selectedProfile.blogUrl || 'Not Connected' }}</div>
                    </div>
                </a>
            </div>
            
            <!-- Footer -->
            <div class="p-4 bg-gray-50 border-t border-gray-100 dark:bg-gray-800/50 dark:border-gray-700 text-center">
                <button @click="selectedProfile = null" class="w-full py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200">
                    닫기
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

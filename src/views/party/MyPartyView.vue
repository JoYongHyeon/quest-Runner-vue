<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {
  type ApplicantDecisionReqDTO,
  partyApi,
  type PartyApplicantResDTO,
  type PartyApplication,
  type PartyKickReqDTO
} from '../../api/partyApi';
import type {Party} from '../../types/Party'; // PartySlot 타입 import 추가

/**
 * MyPartyView.vue
 * - 나의 활동(내가 만든 파티, 내가 지원한 파티)을 통합 관리하는 페이지입니다.
 * - '내가 만든 퀘스트' 탭은 [상세보기] 없이 [관리] 위주의 UX를 제공합니다.
 */

const router = useRouter();
const route = useRoute();

// =========================================
// 1. State (상태 관리)
// =========================================

// 탭 상태 ('CREATED' | 'APPLIED')
const activeTab = ref<'CREATED' | 'APPLIED'>('CREATED');
const isLoading = ref(false);

// [Tab 1] 내가 만든 파티 목록
const myParties = ref<Party[]>([]);

// [Tab 2] 내가 지원한 파티 목록
const myApplications = ref<PartyApplication[]>([]);

// [Modal] 지원자 관리 모달 상태
const isModalOpen = ref(false);
const currentApplicants = ref<PartyApplicantResDTO[]>([]);
const currentPartyId = ref<number | null>(null);


// =========================================
// 2. API Calls (데이터 로드 & 액션)
// =========================================

/**
 * [Tab 1] 내가 만든 파티 목록 조회
 * GET /api/parties/my
 */
const fetchMyParties = async () => {
    try {
        isLoading.value = true;
        const res = await partyApi.getMyParties();
        myParties.value = res;
    } catch (e) {
        console.error('[MyParty] 파티 목록 로드 실패', e);
    } finally {
        isLoading.value = false;
    }
};

/**
 * [Tab 2] 내가 지원한 퀘스트 목록 조회
 * GET /api/parties/my-applied
 */
const fetchMyApplications = async () => {
    try {
        isLoading.value = true;
        myApplications.value = await partyApi.getMyAppliedParties();
    } catch (e) {
        console.error('[MyParty] 지원 내역 로드 실패', e);
    } finally {
        isLoading.value = false;
    }
};

/**
 * 지원 취소 (승인 전 PENDING 상태)
 * DELETE /api/parties/applications/{applicantId}
 */
const cancelApplication = async (applicantId: number) => {
  if (!confirm('정말 지원을 취소하시겠습니까?\n아직 승인되지 않아 이력은 남지 않습니다.')) return;

  try {
    await partyApi.cancelApplication(applicantId);
    alert('지원이 취소되었습니다.');
    /** 목록 갱신 */
    await fetchMyApplications();

  } catch (e: any) {
    console.error(e);
    const msg = e.response?.data?.message || '취소에 실패했습니다.';
    alert(msg);
  }
}

/**
 * 파티 탈퇴 (승인 후 ACCEPTED 상태)
 * PATCH /api/parties/applications/{applicantId}/quit
 */
const quitParty = async (applicantId: number) => {
  if (!confirm('정말 파티를 탈퇴하시겠습니까?\n⚠️ 탈퇴 시 "중도 탈퇴" 기록이 영구적으로 남게 됩니다.')) return;

  try {
    await partyApi.quitParty(applicantId);
    alert('파티에서 탈퇴하였습니다.');
    /** 목록 갱신 */
    await fetchMyApplications();

  } catch (e: any) {
    console.error(e);
    const msg = e.response?.data?.message || '탈퇴 처리에 실패했습니다.';
    alert(msg);
  }
}

/**
 * 강제 추방 (파티장)
 */
const kickApplicant = async (applicantId: number, nickname: string) => {
  // 1. 사유 입력 받기
  const reason = prompt(`'${nickname}'님을 추방하시겠습니까?\\n사유를 입력해주세요 (필수):`);

  // 취소 했거나 빈 값이면 중단
  if (reason === null) return;
  if (!reason.trim()) {
    alert("추방 사유는 필수입니다.");
    return;
  }

  try {
    const req: PartyKickReqDTO = { reason: reason };
    await partyApi.kickApplicant(applicantId, req);

    alert('추방 처리되었습니다. 해당 슬롯이 다시 열렸습니다.');

    // 목록 갱신
    if (currentPartyId.value) {
      currentApplicants.value = await partyApi.getApplicants(currentPartyId.value);
    }
  } catch (e: any) {
    console.error(e);
    alert(e.response?.data?.message || '처리 실패');
  }
}


/**
 * [Modal] 특정 파티의 지원자 목록 조회
 * GET /api/parties/{partyId}/applicants
 */
const openManageModal = async (partyId: number) => {
    currentPartyId.value = partyId;
    isModalOpen.value = true;
    currentApplicants.value = [];

    try {
        const res = await partyApi.getApplicants(partyId);
        currentApplicants.value = res;
    } catch (e) {
        console.error(e);
        // [C-001] 데이터 로드 실패
        alert('지원자 목록을 불러오는데 실패했습니다.');
        isModalOpen.value = false;
    }
};

/**
 * [Action] 지원자 수락/거절 처리
 * PATCH /api/parties/applicants/{applicantId}
 */
const decideApplicant = async (applicantId: number, status: 'ACCEPTED' | 'REJECTED') => {
    if (!confirm(`${status === 'ACCEPTED' ? '수락' : '거절'}하시겠습니까?`)) return;

    try {
        const req: ApplicantDecisionReqDTO = { status };
        await partyApi.decideApplicant(applicantId, req);
        
        // [P-S003] 지원자 상태 변경 성공 메시지
        alert('처리되었습니다.');
        
        // 목록 갱신
        if (currentPartyId.value) {
          currentApplicants.value = await partyApi.getApplicants(currentPartyId.value);
        }
    } catch (e: any) {
        const errorMsg = e.response?.data?.message || '처리에 실패했습니다.';
        alert(errorMsg);
    }
};


// =========================================
// 3. Event Handlers & Lifecycle
// =========================================

const closeModal = () => {
    isModalOpen.value = false;
    currentPartyId.value = null;
};

/**
 * 탭 변경 핸들러
 * - URL 쿼리를 업데이트하고 해당 데이터를 로드합니다.
 */
const changeTab = (tab: 'CREATED' | 'APPLIED') => {
    activeTab.value = tab;
    router.replace({ query: { ...route.query, tab } });
};

// 탭 변경 감지 (데이터 로드 트리거)
watch(activeTab, (newTab) => {
    if (newTab === 'CREATED') {
        fetchMyParties();
    } else {
        fetchMyApplications();
    }
});

// 초기 로딩 (URL 쿼리 파라미터 확인)
onMounted(() => {
    const tabQuery = route.query.tab as string;
    if (tabQuery === 'APPLIED') {
        activeTab.value = 'APPLIED';
    } else {
        fetchMyParties();
    }
});
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    
    <!-- Header & Tabs -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 class="text-2xl font-bold dark:text-[#D7DADC]">내 활동 관리</h1>
        
        <!-- Tab Menu -->
        <div class="flex bg-gray-100 p-1 rounded-lg dark:bg-[#202022]">
            <button @click="changeTab('CREATED')"
                    class="px-4 py-2 text-sm font-bold rounded-md transition-all"
                    :class="activeTab === 'CREATED' 
                        ? 'bg-white shadow text-blue-600 dark:bg-[#272729] dark:text-blue-400' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-[#818384]'">
                내가 만든 퀘스트
            </button>
            <button @click="changeTab('APPLIED')"
                    class="px-4 py-2 text-sm font-bold rounded-md transition-all"
                    :class="activeTab === 'APPLIED' 
                        ? 'bg-white shadow text-green-600 dark:bg-[#272729] dark:text-green-400' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-[#818384]'">
                지원한 퀘스트
            </button>
        </div>
    </div>

    <!-- Tab 1: Created Parties (내가 만든 파티) -->
    <div v-if="activeTab === 'CREATED'">
        <!-- 로딩 중 -->
        <div v-if="isLoading" class="text-center py-20 text-gray-500">로딩 중...</div>

        <!-- 파티 없음 -->
        <div v-else-if="myParties.length === 0" class="text-center py-20 border-2 border-dashed border-gray-300 rounded-lg dark:border-[#343536]">
            <p class="text-gray-500 mb-4 dark:text-[#818384]">아직 생성한 퀘스트가 없습니다.</p>
            <button @click="router.push('/create')" class="btn btn-primary">퀘스트 생성하기</button>
        </div>

        <!-- 파티 목록 -->
        <div v-else class="space-y-4">
            <div v-for="party in myParties" :key="party.partyId" 
                 class="bg-white border border-l-4 border-l-yellow-400 p-4 rounded shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4
                        dark:bg-[#1A282D] dark:border-[#343536] dark:border-l-yellow-500">
                
                <!-- 파티 정보 & 슬롯 현황 -->
                <div class="flex-1 min-w-0">
                    <h3 @click="router.push({ path: `/party/${party.partyId}`, query: { source: 'my-created' } })"
                        class="text-lg font-bold mb-2 dark:text-[#D7DADC] cursor-pointer hover:text-blue-600 transition-colors truncate">
                        {{ party.title }}
                    </h3>
                    
                    <!-- 슬롯 모집 현황 배지 -->
                    <div class="flex flex-wrap gap-1.5 mb-2">
                        <span v-for="slot in party.slots" :key="slot.slotId"
                              class="px-2 py-0.5 text-[10px] font-bold rounded border flex items-center gap-1"
                              :class="slot.status === 'OPEN' 
                                  ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' 
                                  : 'bg-gray-100 text-gray-500 border-gray-200 line-through dark:bg-[#343536] dark:text-gray-500 dark:border-[#555]'">
                            {{ slot.position }}
                            <span v-if="slot.status !== 'OPEN'" class="text-[8px] ml-0.5">✓</span>
                        </span>
                    </div>

                    <div class="flex gap-2 text-xs text-gray-500 dark:text-[#818384]">
                        <span class="badge bg-gray-100 dark:bg-[#343536]">{{ party.status }}</span>
                        <span>{{ party.createdAt.split('T')[0] }}</span>
                    </div>
                </div>

                <!-- 액션 버튼 (관리 모드) -->
                <div class="flex gap-2 shrink-0">
                    <!-- 1. 지원자 관리 -->
                    <button @click="openManageModal(party.partyId)" 
                            class="btn px-3 py-1.5 text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-200
                                   dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50 dark:border-yellow-800">
                        지원자 관리
                    </button>
                    <!-- 2. 파티 관리 (수정) -->
                    <button @click="router.push(`/party/${party.partyId}/edit`)"
                            class="btn px-3 py-1.5 text-xs bg-white text-gray-700 border border-gray-300 hover:bg-gray-50
                                   dark:bg-[#343536] dark:border-[#555] dark:text-[#D7DADC] dark:hover:bg-[#404142]">
                        파티 관리
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Tab 2: Applied Parties (지원한 파티) -->
    <div v-else>
        <!-- 로딩 중 -->
        <div v-if="isLoading" class="text-center py-20 text-gray-500">로딩 중...</div>

        <!-- 지원 내역 없음 -->
        <div v-else-if="myApplications.length === 0" class="text-center py-20 border-2 border-dashed border-gray-300 rounded-lg dark:border-[#343536]">
            <p class="text-gray-500 mb-4 dark:text-[#818384]">아직 지원한 퀘스트가 없습니다.</p>
            <button @click="router.push('/')" class="btn btn-primary">퀘스트 찾으러 가기</button>
        </div>

        <!-- 지원 목록 -->
        <div v-else class="space-y-4">
            <div v-for="app in myApplications" :key="app.partyId" 
                 class="bg-white border border-l-4 border-l-green-400 p-4 rounded shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4
                        dark:bg-[#1A282D] dark:border-[#343536] dark:border-l-green-500">
                
                <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-bold mb-1 dark:text-[#D7DADC]">{{ app.title }}</h3>
                    <div class="flex gap-2 text-xs text-gray-500 dark:text-[#818384]">
                        <span class="font-bold text-gray-700 dark:text-gray-300">리더: {{ app.leaderNickname }}</span>
                        <span>•</span>
                        <span>지원 포지션: <span class="font-bold text-blue-600 dark:text-blue-400">{{ app.position }}</span></span>
                        <span>•</span>
                        <span>{{ app.appliedAt.split('T')[0] }}</span>
                    </div>
                </div>

                <div class="flex items-center gap-3 shrink-0">
                    <!-- 상태 뱃지 -->
                    <span class="px-3 py-1 text-xs font-bold rounded-full"
                          :class="{
                              'bg-yellow-100 text-yellow-800': app.status === 'PENDING',
                              'bg-green-100 text-green-800': app.status === 'ACCEPTED',
                              'bg-red-100 text-red-800': app.status === 'REJECTED'
                          }">
                        {{ app.status }}
                    </span>


                  <!-- 상태별 액션 버튼 -->
                  <!-- 1. 승인 전 취소 (PENDING) -->
                  <button v-if="app.status === 'PENDING'"
                          @click="cancelApplication(app.applicantId)"
                          class="btn px-3 py-1.5 text-xs bg-red-50 text-red-600 border border-red-100 hover:bg-red-100
                                 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/40">
                    지원 취소
                  </button>

                  <!-- 2. 승인 후 취소 (ACCEPTED) -->
                  <button v-else-if="app.status === 'ACCEPTED'"
                          @click="quitParty(app.applicantId)"
                          class="btn px-3 py-1.5 text-xs bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:text-red-600
                                 dark:bg-[#343536] dark:text-[#D7DADC] dark:border-[#555] dark:hover:text-red-400">
                    탈퇴하기
                  </button>

                    <!-- 상세보기 -->
                    <button @click="router.push({ path: `/party/${app.partyId}`, query: { source: 'my-applied' } })" 
                            class="btn px-3 py-1.5 text-xs bg-white border border-gray-300 text-gray-700 hover:bg-gray-50
                                   dark:bg-[#272729] dark:border-[#555] dark:text-[#D7DADC] dark:hover:bg-[#333]">
                        상세보기
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- 관리 모달 (지원자 관리용) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="closeModal">
        <div class="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden dark:bg-[#1A282D]">
            <div class="bg-yellow-400 p-4 flex justify-between items-center dark:bg-yellow-600">
                <h3 class="font-bold text-white">📜 지원자 목록</h3>
                <button @click="closeModal" class="text-white hover:text-gray-200">✕</button>
            </div>
            
            <div class="p-4 max-h-[60vh] overflow-y-auto">
                <div v-if="currentApplicants.length === 0" class="text-center py-8 text-gray-500 dark:text-[#818384]">
                    아직 지원자가 없습니다.
                </div>
                
                <div v-else class="space-y-3">
                    <div v-for="app in currentApplicants" :key="app.applicantId" 
                         class="border p-3 rounded flex justify-between items-start dark:border-[#343536]">
                        <div>
                            <div class="font-bold text-sm dark:text-[#D7DADC]">
                                {{ app.nickname }} <span class="text-gray-500 font-normal dark:text-[#818384]">({{ app.position }})</span>
                            </div>
                            
                            <!-- 링크 정보 섹션 추가 -->
                            <div class="mt-2 text-xs space-y-1 bg-gray-50 p-2 rounded border dark:bg-[#202022] dark:border-[#343536]">
                                <div class="flex gap-2 items-center">
                                    <span class="font-bold w-12 text-gray-500">GitHub</span>
                                    <a v-if="app.gitUrl" :href="app.gitUrl" target="_blank" class="text-blue-600 hover:underline truncate flex-1">{{ app.gitUrl }}</a>
                                    <span v-else class="text-gray-400">-</span>
                                </div>
                                <div class="flex gap-2 items-center">
                                    <span class="font-bold w-12 text-gray-500">Blog</span>
                                    <a v-if="app.blogUrl" :href="app.blogUrl" target="_blank" class="text-blue-600 hover:underline truncate flex-1">{{ app.blogUrl }}</a>
                                    <span v-else class="text-gray-400">-</span>
                                </div>
                                <div class="flex gap-2 items-center">
                                    <span class="font-bold w-12 text-gray-500">Resume</span>
                                    <a v-if="app.resumeLink" :href="app.resumeLink" target="_blank" class="text-blue-600 hover:underline truncate flex-1">{{ app.resumeLink }}</a>
                                    <span v-else class="text-gray-400">-</span>
                                </div>
                            </div>

                            <p class="text-xs text-gray-600 mt-2 dark:text-[#999]">"{{ app.message }}"</p>
                            <span class="inline-block mt-2 text-[10px] px-2 py-0.5 rounded"
                                  :class="{
                                      'bg-yellow-100 text-yellow-800': app.status === 'PENDING',
                                      'bg-green-100 text-green-800': app.status === 'ACCEPTED',
                                      'bg-red-100 text-red-800': ['REJECTED', 'QUIT', 'KICKED'].includes(app.status)
                                  }">
                                {{ app.status }}
                            </span>
                        </div>

                      <!-- PENDING 상태 버튼 -->
                        <div v-if="app.status === 'PENDING'" class="flex gap-1">
                            <button @click="decideApplicant(app.applicantId, 'ACCEPTED')" 
                                    class="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">수락</button>
                            <button @click="decideApplicant(app.applicantId, 'REJECTED')" 
                                    class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">거절</button>
                        </div>

                      <!-- ACCEPTED 상태일 때 '추방' 버튼 표시 -->
                      <div v-if="app.status === 'ACCEPTED'" class="flex gap-1">
                        <button @click="kickApplicant(app.applicantId, app.nickname)"
                                class="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 shadow-sm transition-colors">
                          추방
                        </button>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { partyApi, type PartyApplicantResDTO, type ApplicantDecisionReqDTO } from '../../api/partyApi';
import type { Party } from '../../types/Party';

/**
 * MyPartyView.vue
 * - 나의 활동(내가 만든 파티, 내가 지원한 파티)을 통합 관리하는 페이지입니다.
 * - 탭 메뉴를 통해 'Created(리더)'와 'Applied(지원자)' 모드를 전환합니다.
 */

const router = useRouter();

// 탭 상태 ('CREATED' | 'APPLIED')
const activeTab = ref<'CREATED' | 'APPLIED'>('CREATED');

// 내가 만든 파티 상태
const myParties = ref<Party[]>([]);
const isLoading = ref(false);

// 모달 상태 (지원자 관리용)
const isModalOpen = ref(false);
const currentApplicants = ref<PartyApplicantResDTO[]>([]);
const currentPartyId = ref<number | null>(null);

// 1. 내가 만든 파티 목록 조회
const fetchMyParties = async () => {
    try {
        isLoading.value = true;
        const res = await partyApi.getMyParties();
        myParties.value = res;
    } catch (e) {
        console.error(e);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchMyParties();
});

// 2. 지원자 관리 모달 열기
const openManageModal = async (partyId: number) => {
    currentPartyId.value = partyId;
    isModalOpen.value = true;
    currentApplicants.value = [];

    try {
        const res = await partyApi.getApplicants(partyId);
        currentApplicants.value = res;
    } catch (e) {
        console.error(e);
        alert('지원자 목록을 불러오는데 실패했습니다.');
        isModalOpen.value = false;
    }
};

// 3. 수락/거절 처리
const decideApplicant = async (applicantId: number, status: 'ACCEPTED' | 'REJECTED') => {
    if (!confirm(`${status === 'ACCEPTED' ? '수락' : '거절'}하시겠습니까?`)) return;

    try {
        const req: ApplicantDecisionReqDTO = { status };
        await partyApi.decideApplicant(applicantId, req);
        
        alert('처리되었습니다.');
        if (currentPartyId.value) {
            const res = await partyApi.getApplicants(currentPartyId.value);
            currentApplicants.value = res;
        }
    } catch (e: any) {
        const errorMsg = e.response?.data?.message || '처리에 실패했습니다.';
        alert(errorMsg);
    }
};

const closeModal = () => {
    isModalOpen.value = false;
    currentPartyId.value = null;
};
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    
    <!-- Header & Tabs -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 class="text-2xl font-bold dark:text-[#D7DADC]">내 활동 관리</h1>
        
        <!-- Tab Menu -->
        <div class="flex bg-gray-100 p-1 rounded-lg dark:bg-[#202022]">
            <button @click="activeTab = 'CREATED'"
                    class="px-4 py-2 text-sm font-bold rounded-md transition-all"
                    :class="activeTab === 'CREATED' 
                        ? 'bg-white shadow text-blue-600 dark:bg-[#272729] dark:text-blue-400' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-[#818384]'">
                👑 내가 만든 퀘스트
            </button>
            <button @click="activeTab = 'APPLIED'"
                    class="px-4 py-2 text-sm font-bold rounded-md transition-all"
                    :class="activeTab === 'APPLIED' 
                        ? 'bg-white shadow text-green-600 dark:bg-[#272729] dark:text-green-400' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-[#818384]'">
                🛡️ 지원한 퀘스트
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
                 class="bg-white border border-l-4 border-l-yellow-400 p-4 rounded shadow-sm flex justify-between items-center
                        dark:bg-[#1A282D] dark:border-[#343536] dark:border-l-yellow-500">
                <div>
                    <h3 class="text-lg font-bold mb-1 dark:text-[#D7DADC]">{{ party.title }}</h3>
                    <div class="flex gap-2 text-xs text-gray-500 dark:text-[#818384]">
                        <span class="badge bg-gray-100 dark:bg-[#343536]">{{ party.status }}</span>
                        <span>{{ party.createdAt.split('T')[0] }}</span>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button @click="router.push(`/party/${party.partyId}`)" 
                            class="btn px-3 py-1.5 text-xs bg-white border border-gray-300 text-gray-700 hover:bg-gray-50
                                   dark:bg-[#272729] dark:border-[#555] dark:text-[#D7DADC] dark:hover:bg-[#333]">
                        상세보기
                    </button>
                    <button @click="openManageModal(party.partyId)" 
                            class="btn px-3 py-1.5 text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-200
                                   dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50">
                        지원자 관리
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Tab 2: Applied Parties (지원한 파티) -->
    <div v-else>
        <!-- TODO: 백엔드 API 구현 후 연동 -->
        <div class="text-center py-20 border-2 border-dashed border-gray-300 rounded-lg dark:border-[#343536]">
            <div class="text-4xl mb-4">🚧</div>
            <p class="text-gray-500 font-bold mb-2 dark:text-[#D7DADC]">기능 준비 중</p>
            <p class="text-sm text-gray-400 dark:text-[#818384]">
                '지원한 퀘스트 목록' 조회 기능은 현재 개발 중입니다.<br/>
                백엔드 API 구현 후 업데이트될 예정입니다.
            </p>
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
                            <p class="text-xs text-gray-600 mt-1 dark:text-[#999]">"{{ app.message }}"</p>
                            <span class="inline-block mt-2 text-[10px] px-2 py-0.5 rounded"
                                  :class="{
                                      'bg-yellow-100 text-yellow-800': app.status === 'PENDING',
                                      'bg-green-100 text-green-800': app.status === 'ACCEPTED',
                                      'bg-red-100 text-red-800': app.status === 'REJECTED'
                                  }">
                                {{ app.status }}
                            </span>
                        </div>
                        
                        <div v-if="app.status === 'PENDING'" class="flex gap-1">
                            <button @click="decideApplicant(app.applicantId, 'ACCEPTED')" 
                                    class="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">수락</button>
                            <button @click="decideApplicant(app.applicantId, 'REJECTED')" 
                                    class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">거절</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

  </div>
</template>
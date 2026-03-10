<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {
  partyApi,
  type PartyApplicationResDTO
} from '../../api/partyApi';
import type {Party} from '../../types/Party';

/**
 * MyPartyView.vue
 * - 나의 활동(내가 만든 퀘스트, 내가 지원한 퀘스트)을 통합 관리하는 대시보드 페이지입니다.
 * - [Update] 대시보드에서는 현황만 보여주고(탈퇴 버튼 제거), 중요한 액션은 상세 페이지로 유도합니다.
 */

const router = useRouter();
const route = useRoute();

const activeTab = ref<'CREATED' | 'APPLIED'>('CREATED');
const isLoading = ref(false);

const myParties = ref<Party[]>([]); 
const myApplications = ref<PartyApplicationResDTO[]>([]);

const fetchMyParties = async () => {
    try {
        isLoading.value = true;
        myParties.value = await partyApi.getMyParties();
    } catch (e) {
        console.error('[MyParty] 파티 목록 로드 실패', e);
    } finally {
        isLoading.value = false;
    }
};

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
 * 승인 전 지원 취소 (PENDING)
 * - 승인 전이므로 대시보드에서 가볍게 취소할 수 있도록 유지합니다.
 */
const cancelApplication = async (applicantId: number) => {
  if (!confirm('정말 지원을 취소하시겠습니까?')) return;
  try {
    await partyApi.cancelApplication(applicantId);
    alert('지원이 취소되었습니다.');
    await fetchMyApplications();
  } catch (e: any) {
    alert(e.response?.data?.message || '취소 실패');
  }
}

const changeTab = (tab: 'CREATED' | 'APPLIED') => {
    activeTab.value = tab;
    router.replace({ query: { ...route.query, tab } });
};

watch(activeTab, (newTab) => {
    newTab === 'CREATED' ? fetchMyParties() : fetchMyApplications();
});

onMounted(() => {
    const tabQuery = route.query.tab as string;
    tabQuery === 'APPLIED' ? activeTab.value = 'APPLIED' : fetchMyParties();
});
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    
    <!-- Header & Tabs -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 class="text-3xl font-black dark:text-[#D7DADC] tracking-tight text-gray-900">퀘스트 대시보드</h1>
        
        <div class="flex bg-gray-100 p-1.5 rounded-xl dark:bg-[#202022] shadow-inner">
            <button @click="changeTab('CREATED')"
                    class="px-6 py-2.5 text-sm font-black rounded-lg transition-all"
                    :class="activeTab === 'CREATED' 
                        ? 'bg-white shadow-md text-blue-600 dark:bg-[#272729] dark:text-blue-400' 
                        : 'text-gray-400 hover:text-gray-600 dark:text-[#818384]'">
                내가 만든 퀘스트
            </button>
            <button @click="changeTab('APPLIED')"
                    class="px-6 py-2.5 text-sm font-black rounded-lg transition-all"
                    :class="activeTab === 'APPLIED' 
                        ? 'bg-white shadow-md text-emerald-600 dark:bg-[#272729] dark:text-emerald-400' 
                        : 'text-gray-400 hover:text-gray-600 dark:text-[#818384]'">
                지원한 퀘스트
            </button>
        </div>
    </div>

    <!-- Tab 1: Created Parties -->
    <div v-if="activeTab === 'CREATED'" class="space-y-4">
        <div v-if="isLoading" class="text-center py-20 text-gray-400 font-bold">정보를 불러오는 중...</div>
        <div v-else-if="myParties.length === 0" class="text-center py-24 border-4 border-dashed border-gray-200 rounded-[2rem] dark:border-[#343536]">
            <p class="text-gray-400 mb-6 font-bold">아직 생성한 퀘스트가 없습니다.</p>
            <button @click="router.push('/create')" class="px-8 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all shadow-lg active:scale-95">새로운 퀘스트 만들기</button>
        </div>

        <div v-for="party in myParties" :key="party.partyId" 
             class="relative bg-white border-2 p-6 rounded-[1.5rem] flex flex-col sm:flex-row justify-between items-center gap-6 transition-all dark:bg-[#1A282D] dark:border-[#343536]"
             :class="party.status === 'CANCELED' ? 'opacity-50 grayscale bg-gray-50 border-gray-200' : 'border-gray-100 hover:border-blue-200 hover:shadow-xl shadow-sm'">
            
            <div v-if="party.status === 'CANCELED'" class="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-tr-[1.2rem] rounded-bl-xl uppercase tracking-tighter">취소됨</div>

            <div class="flex-1 min-w-0 w-full">
                <h3 @click="party.status !== 'CANCELED' && router.push(`/party/${party.partyId}`)"
                    class="text-xl font-black mb-3 transition-colors truncate text-gray-900 dark:text-[#D7DADC]"
                    :class="party.status === 'CANCELED' ? 'cursor-not-allowed' : 'cursor-pointer hover:text-blue-600'">
                    {{ party.title }}
                </h3>
                
                <div class="flex flex-wrap gap-2 mb-4">
                    <span v-for="slot in party.slots" :key="slot.slotId"
                          class="px-3 py-1 text-[10px] font-black rounded-lg border uppercase tracking-widest"
                          :class="slot.status === 'OPEN' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-100 text-gray-400 border-gray-200 line-through'">
                        {{ slot.position }}
                    </span>
                </div>

                <div class="flex gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span class="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#343536]">{{ party.status }}</span>
                    <span>생성일: {{ party.createdAt.split('T')[0] }}</span>
                </div>
            </div>

            <div v-if="party.status !== 'CANCELED'" class="flex gap-2 shrink-0 w-full sm:w-auto">
                <button @click="router.push(`/party/${party.partyId}`)" class="flex-1 sm:flex-none px-6 py-3 bg-gray-900 text-white rounded-xl font-black hover:bg-black transition-all active:scale-95 text-xs">팀원 관리 및 현황</button>
                <button @click="router.push(`/party/${party.partyId}/edit`)" class="flex-1 sm:flex-none px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-black hover:bg-gray-50 transition-all active:scale-95 text-xs">정보 수정</button>
            </div>
        </div>
    </div>

    <!-- Tab 2: Applied Parties -->
    <div v-else class="space-y-4">
        <div v-if="myApplications.length === 0" class="text-center py-24 border-4 border-dashed border-gray-200 rounded-[2rem] dark:border-[#343536]">
            <p class="text-gray-400 mb-6 font-bold">아직 지원한 퀘스트가 없습니다.</p>
            <button @click="router.push('/')" class="px-8 py-3 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-700 transition-all shadow-lg active:scale-95">함께할 퀘스트 찾기</button>
        </div>

        <div v-for="app in myApplications" :key="app.partyId" 
             class="bg-white border-2 border-gray-100 p-6 rounded-[1.5rem] flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm hover:shadow-xl transition-all dark:bg-[#1A282D] dark:border-[#343536]">
            
            <div class="flex-1 min-w-0 w-full">
                <h3 class="text-xl font-black mb-2 dark:text-[#D7DADC] text-gray-900 truncate">{{ app.title }}</h3>
                <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span class="text-blue-600 dark:text-blue-400">지원 포지션: {{ app.position }}</span>
                    <span>•</span>
                    <span>리더: {{ app.leaderNickname }}</span>
                </div>
            </div>

            <div class="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                <span class="px-4 py-2 text-[10px] font-black rounded-xl uppercase tracking-[0.2em] shadow-inner"
                      :class="{
                          'bg-yellow-100 text-yellow-700': app.status === 'PENDING',
                          'bg-emerald-100 text-emerald-700': app.status === 'ACCEPTED',
                          'bg-red-100 text-red-700': ['REJECTED', 'KICKED', 'QUIT'].includes(app.status)
                      }">
                    {{ app.status }}
                </span>

                <!-- [Fix] PENDING 일 때의 '지원 취소' 버튼은 유지 (승인 전 가벼운 취소) -->
                <button v-if="app.status === 'PENDING' && app.partyStatus !== 'CANCELED'" 
                        @click="cancelApplication(app.applicantId)" 
                        class="px-4 py-2 text-[10px] font-black text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    지원 취소
                </button>

                <!-- [Fix] ACCEPTED 일 때의 '퀘스트 탈퇴' 버튼 제거 (상세 페이지로 동선 일원화) -->
                
                <button @click="router.push(`/party/${app.partyId}`)" 
                        class="px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-black hover:bg-gray-200 transition-all text-xs">
                    상세 보기
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

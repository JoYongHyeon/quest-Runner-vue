<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { partyApi } from '../../api/partyApi';
import type { Party, PartySearchCondition, PartySlot } from '../../types/Party';
import { formatDateTime } from '../../utils/dateUtils'; // 유틸리티 추가

/**
 * PartyListView.vue
 * - 메인 피드 역할을 하는 파티 목록 조회 페이지입니다.
 * - 실제 API를 호출하여 파티 목록을 불러오고 렌더링합니다.
 */

const router = useRouter();

// 파티 목록 상태 관리
const parties = ref<Party[]>([]);
const isLoading = ref(false);

/**
 * 파티 목록 조회 (API 호출)
 * - 현재는 기본 페이징(0, 10)으로 전체 조회합니다.
 */
const fetchParties = async () => {
    try {
        isLoading.value = true;
        const condition: PartySearchCondition = {
            page: 0,
            size: 10
        };
        const res = await partyApi.getPartyList(condition);
        parties.value = res.content;
    } catch (e) {
        console.error('파티 목록 로딩 실패', e);
    } finally {
        isLoading.value = false;
    }
};

// 초기 로딩
onMounted(() => {
    fetchParties();
});

/**
 * 상세 페이지 이동 핸들러
 */
const goToDetail = (partyId: number) => {
    router.push(`/party/${partyId}`);
};

/**
 * 모집 현황 계산 (예: 1/4)
 * - OPEN이 아닌 슬롯(채워진 슬롯) / 전체 슬롯
 */
const getRecruitStatus = (slots: PartySlot[]) => {
    const total = slots.length;
    const filled = slots.filter(s => s.status !== 'OPEN').length; 
    return `(${filled}/${total})`;
};
</script>

<template>
  <div class="space-y-4">
    <!-- Filter Bar -->
    <div class="bg-white p-2 rounded border border-gray-200 shadow-sm flex gap-2 overflow-x-auto no-scrollbar mb-4
                dark:bg-[var(--color-reddit-card)] dark:border-[var(--color-reddit-border)]">
        <button class="btn bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm rounded-full whitespace-nowrap px-4 border-none shadow-none
                       dark:bg-[#272729] dark:text-[#D7DADC] dark:hover:bg-[#333335]">
            🔥 인기순
        </button>
        <button class="btn hover:bg-gray-100 text-gray-600 text-sm rounded-full whitespace-nowrap px-4 border-none shadow-none
                       dark:text-[#818384] dark:hover:bg-[#272729]">
            ✨ 최신순
        </button>
        <div class="h-6 w-px bg-gray-300 mx-1 self-center dark:bg-[#343536]"></div>
         <button class="btn hover:bg-gray-100 text-gray-600 text-sm rounded-full whitespace-nowrap px-4 border-none shadow-none
                        dark:text-[#818384] dark:hover:bg-[#272729]">
            🗺️ 서울
        </button>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="text-center py-10 text-gray-500 dark:text-[#818384]">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mx-auto mb-2"></div>
        퀘스트를 불러오는 중... ⚔️
    </div>

    <!-- 데이터 없음 -->
    <div v-else-if="parties.length === 0" class="text-center py-10 text-gray-500 dark:text-[#818384]">
        아직 등록된 퀘스트가 없습니다. 첫 번째 모험을 시작해보세요!
    </div>

    <!-- Party Feed Items -->
    <div v-else v-for="(party, index) in parties" :key="party.partyId" 
         @click="goToDetail(party.partyId)"
         class="card card-hover flex overflow-hidden group mb-3 relative pl-4">
        
        <!-- 1. Ranking Number (Upvote 대체) -->
        <div class="absolute left-0 top-0 bottom-0 w-10 flex items-start justify-center pt-4 text-lg font-bold text-gray-300 dark:text-gray-600">
            {{ index + 1 }}
        </div>
        
        <!-- Content -->
        <div class="p-3 pl-8 flex-1">
            <div class="flex items-center gap-2 text-xs text-gray-500 mb-2 dark:text-[#818384]">
                <span class="font-bold text-gray-900 hover:underline dark:text-[#D7DADC]">{{ party.leaderNickname }}</span>
                <span>•</span>
                <!-- 2. 날짜 포맷 변경 -->
                <span>{{ formatDateTime(party.createdAt) }}</span>
                <span>•</span>
                <span class="badge badge-primary">{{ party.region }}</span>
            </div>
            
            <!-- 3. 모집 인원 표시 -->
            <h3 class="text-lg font-medium text-gray-900 mb-3 group-hover:text-blue-600 transition-colors
                       dark:text-[#D7DADC] dark:group-hover:text-blue-400 flex items-center gap-2">
                {{ party.title }}
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {{ getRecruitStatus(party.slots) }}
                </span>
            </h3>
            
            <div class="flex flex-wrap gap-2 mb-3">
                    <span v-for="slot in party.slots" :key="slot.slotId" 
                    class="badge border"
                    :class="slot.status === 'OPEN' 
                        ? 'bg-green-50 border-green-200 text-green-700 dark:bg-transparent dark:border-[#343536] dark:text-[#46D160]' 
                        : 'bg-gray-100 border-gray-200 text-gray-400 line-through dark:bg-transparent dark:border-transparent dark:text-[#5d5e5f]'"
                    >
                    {{ slot.position }}
                    </span>
            </div>
            
            <div class="flex gap-1 text-gray-500 text-xs font-bold dark:text-[#818384]">
                <button class="flex items-center gap-1 hover:bg-gray-100 px-2 py-2 rounded transition-colors dark:hover:bg-[#272729]">
                    <span>💬</span> 0 댓글
                </button>
                <button class="flex items-center gap-1 hover:bg-gray-100 px-2 py-2 rounded transition-colors dark:hover:bg-[#272729]">
                    <span>↗️</span> 공유
                </button>
                <button class="flex items-center gap-1 hover:bg-gray-100 px-2 py-2 rounded transition-colors dark:hover:bg-[#272729]">
                    <span>🔖</span> 저장
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import PartyCreateForm from '../../components/domain/PartyCreateForm.vue';

const route = useRoute();
// URL에 id가 있으면 수정 모드로 간주
const partyId = computed(() => route.params.id ? Number(route.params.id) : undefined);

// 탭 관리 (파티, 커뮤니티, 질문 등)
const activeTab = ref('PARTY');
const tabs = [
    { id: 'PARTY', label: '파티 모집', disabled: false },
    { id: 'COMMUNITY', label: '자유 게시판', disabled: true },
    { id: 'QNA', label: '질문 & 답변', disabled: true },
];
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <!-- 헤더 -->
    <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-[#D7DADC]">
            {{ partyId ? '퀘스트 수정' : '콘텐츠 생성' }}
        </h1>
    </div>

    <!-- 탭 메뉴 (수정 모드일 때는 숨김) -->
    <div v-if="!partyId" class="flex border-b border-gray-200 dark:border-[#343536] mb-6">
        <button v-for="tab in tabs" :key="tab.id"
                @click="!tab.disabled && (activeTab = tab.id)"
                class="px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center"
                :class="activeTab === tab.id 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                    : 'border-transparent text-gray-500 hover:bg-gray-50 dark:text-[#818384] dark:hover:bg-[#272729]'"
                :disabled="tab.disabled">
            {{ tab.label }}
            <span v-if="tab.disabled" class="text-[10px] bg-gray-200 text-gray-600 px-1.5 rounded ml-2 dark:bg-gray-700 dark:text-gray-400">Soon</span>
        </button>
    </div>

    <!-- 콘텐츠 영역 -->
    <div class="bg-white rounded-lg border border-gray-200 p-6 dark:bg-[#1A282D] dark:border-[#343536]">
        <!-- partyId prop 전달 & key 변경으로 강제 리렌더링 유도 -->
        <PartyCreateForm v-if="activeTab === 'PARTY'" :partyId="partyId" :key="String(partyId || 'create')" />
        <div v-else class="text-center py-10 text-gray-500 dark:text-[#818384]">준비 중입니다. 🚧</div>
    </div>
  </div>
</template>

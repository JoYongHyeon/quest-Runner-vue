<script setup lang="ts">
import { ref } from 'vue';
import PartyCreateForm from '../../components/domain/PartyCreateForm.vue';

// 탭 관리 (파티, 커뮤니티, 질문 등)
const activeTab = ref('PARTY');
const tabs = [
    { id: 'PARTY', label: '⚔️ 파티 모집', disabled: false },
    { id: 'COMMUNITY', label: '📝 자유 게시판', disabled: true },
    { id: 'QNA', label: '❓ 질문 & 답변', disabled: true },
];
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <!-- 헤더 -->
    <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-[#D7DADC]">콘텐츠 생성</h1>
    </div>

    <!-- 탭 메뉴 -->
    <div class="flex border-b border-gray-200 dark:border-[#343536] mb-6">
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
        <PartyCreateForm v-if="activeTab === 'PARTY'" />
        <div v-else class="text-center py-10 text-gray-500 dark:text-[#818384]">준비 중입니다. 🚧</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { PartyDetailResDTO } from '../../../../api/partyApi';

/**
 * MemberActionPanel.vue
 * - [상태: ACCEPTED]
 * - 파티 멤버를 위한 패널 (채팅방 링크, 탈퇴하기 등)
 */

defineProps<{
  party: PartyDetailResDTO;
}>();

const router = useRouter();

const goToMyParty = () => {
    router.push('/my-party?tab=APPLIED');
};
</script>

<template>
  <div class="flex flex-col gap-4 p-6 bg-green-50 border-4 border-black dark:bg-[#202022] dark:border-[#343536] text-center">
    <div class="text-3xl mb-2">🎉</div>
    <h3 class="text-xl font-bold text-green-700 dark:text-green-400">환영합니다! 동료가 되셨군요.</h3>
    <p class="text-sm text-gray-600 dark:text-gray-400">
        파티장 <strong>{{ party.leaderNickname }}</strong>님과 함께 멋진 여정을 시작하세요.
    </p>

    <!-- 멤버 전용 링크 -->
    <div v-if="party.linkList && party.linkList.length > 0" class="mt-4 p-4 bg-white rounded border-2 border-gray-200 text-left dark:bg-[#272729] dark:border-[#555]">
        <p class="text-xs font-bold text-gray-500 mb-2 uppercase">Member Links</p>
        <ul class="space-y-2">
            <li v-for="(link, idx) in party.linkList" :key="idx" class="flex items-center gap-2 text-sm">
                <span class="font-bold">🔗 {{ link.label }}:</span>
                <a :href="link.url" target="_blank" class="text-blue-600 hover:underline truncate">{{ link.url }}</a>
            </li>
        </ul>
    </div>
    <div v-else class="mt-4 p-4 bg-white/50 rounded border border-dashed border-gray-400 text-sm text-gray-500">
        아직 등록된 멤버 전용 링크가 없습니다.
    </div>

    <div class="mt-4 flex justify-center gap-2">
        <button @click="goToMyParty" class="btn btn-outline-secondary text-sm bg-white hover:bg-gray-100 dark:bg-[#343536] dark:border-[#555] dark:text-[#D7DADC] dark:hover:bg-[#404142]">
            내 활동 관리 (탈퇴 등)
        </button>
    </div>
  </div>
</template>
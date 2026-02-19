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

const actionPanelComponent = computed(() => {
  if (isLeader.value) return LeaderActionPanel;
  if (myStatus.value === 'ACCEPTED') return MemberActionPanel;
  if (myStatus.value === 'PENDING') return PendingActionPanel;
  if (['REJECTED', 'KICKED', 'QUIT'].includes(myStatus.value || '')) return BannedActionPanel;
  return GuestActionPanel;
});

// --- Methods ---
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

const handleSlotSelect = (slot: any) => {
  if (isLeader.value || myStatus.value) return;
  if (slot.status !== 'OPEN') return;
  selectedSlotId.value = selectedSlotId.value === slot.slotId ? null : slot.slotId;
};

// [NEW] 프로필 보기 핸들러
const handleShowProfile = (member: MatchedMemberDTO) => {
    let info = `👤 [${member.nickname}] 님의 정보\n\n`;
    info += member.gitUrl ? `🔗 GitHub: ${member.gitUrl}\n` : '🔗 GitHub: (비공개)\n';
    info += member.blogUrl ? `📝 Blog: ${member.blogUrl}\n` : '📝 Blog: (비공개)\n';
    alert(info);
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
            @select="handleSlotSelect"
            @showProfile="handleShowProfile"
        />

        <hr class="my-8 border-gray-100 dark:border-[#343536]">

        <!-- Action Panel -->
        <component 
            :is="actionPanelComponent" 
            :party="party" 
            :selected-slot-id="selectedSlotId"
            @refresh="fetchPartyDetail"
        />
      </div>
    </div>
  </div>
</template>

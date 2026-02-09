<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { partyApi, type PartyDetailResDTO, type PartyApplyReqDTO, type SlotResDTO } from '../../api/partyApi';
import { useAuth } from '../../composables/useAuth';

/**
 * PartyDetailView.vue
 * - 파티 상세 정보 및 슬롯 상태를 보여주는 페이지입니다.
 * - 레트로 윈도우 UI 컨셉을 적용합니다.
 */

const route = useRoute();
const router = useRouter();
const partyId = Number(route.params.id);
const { requireOnboarding } = useAuth();

const party = ref<PartyDetailResDTO | null>(null);
const selectedSlotId = ref<number | null>(null);
const applyMessage = ref('');
const isLoading = ref(true);

// 파티 상세 정보 로드
const fetchPartyDetail = async () => {
    try {
        const res = await partyApi.getPartyDetail(partyId);
        party.value = res;
    } catch (e) {
        console.error('파티 상세 로드 실패', e);
        alert('존재하지 않거나 삭제된 파티입니다.');
        router.push('/');
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchPartyDetail();
});

/**
 * 슬롯 선택 핸들러
 * - OPEN 상태인 슬롯을 클릭하면 선택 상태가 되며, 하단 입력창이 활성화됩니다.
 */
const selectSlot = (slot: SlotResDTO) => {
    if (slot.status !== 'OPEN') return;
    
    // 이미 선택된 슬롯을 다시 누르면 선택 해제
    if (selectedSlotId.value === slot.slotId) {
        selectedSlotId.value = null;
        applyMessage.value = '';
    } else {
        selectedSlotId.value = slot.slotId;
    }
};

/**
 * 지원하기 핸들러 (JOIN 버튼 클릭)
 */
const handleApply = async () => {
    // 1. 공통 가드 확인
    if (!requireOnboarding()) return;

    if (!selectedSlotId.value) {
        alert('지원할 포지션(슬롯)을 먼저 선택해주세요! 🛡️');
        return;
    }

    if (!applyMessage.value.trim()) {
        alert('파티장에게 보낼 한마디를 입력해주세요!');
        return;
    }

    try {
        const req: PartyApplyReqDTO = {
            slotId: selectedSlotId.value,
            message: applyMessage.value
        };
        await partyApi.applyParty(req);
        
        alert('지원이 완료되었습니다! 파티장의 수락을 기다려주세요. 🙏');
        router.go(0); // 새로고침하여 슬롯 상태 반영
    } catch (e: any) {
        const errorMsg = e.response?.data?.message || '지원에 실패했습니다. 다시 시도해주세요.';
        alert(errorMsg);
        console.error(e);
    }
};
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    
    <!-- 로딩 중 -->
    <div v-if="isLoading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-500 dark:text-[#818384]">던전 정보를 읽어오는 중...</p>
    </div>

    <!-- Retro Window UI -->
    <div v-else-if="party" class="bg-[#ecf0f1] border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.5)] text-[#2c3e50] mb-6 font-mono
                                  dark:bg-[#202022] dark:border-[#343536] dark:shadow-none dark:text-[#D7DADC]">
        
        <!-- Header -->
        <div class="bg-[#3498db] text-white p-3 border-b-4 border-black flex justify-between items-center font-bold select-none
                    dark:bg-[#1A282D] dark:border-[#343536] dark:text-[#D7DADC]">
            <span class="truncate">QUEST: {{ party.title }}</span>
        </div>

        <!-- Body -->
        <div class="p-6">
            
            <!-- Info Badge -->
            <div class="text-center mb-8">
                <span class="inline-block bg-black text-white px-3 py-1 text-sm font-bold uppercase rounded-sm mb-2
                             dark:bg-[#343536] dark:text-[#D7DADC]">
                    {{ party.region }}
                </span>
                <p class="text-xs text-gray-500 font-bold dark:text-[#818384]">CREATED AT {{ party.createdAt.split('T')[0] }}</p>
            </div>

            <!-- Slots Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                
                <!-- 1. Leader Slot (Fixed) -->
                <div class="bg-[#f1c40f] border-4 border-black h-40 flex flex-col items-center justify-center p-2 text-center shadow-sm select-none cursor-default
                            dark:bg-[#D9A521] dark:border-[#343536]">
                    <div class="text-3xl mb-2">🤴</div>
                    <div class="text-xs font-bold truncate w-full">{{ party.leaderNickname }}</div>
                    <div class="bg-black text-white text-[10px] px-1.5 py-0.5 mt-1 rounded-sm dark:bg-[#1A282D]">LEADER</div>
                </div>

                <!-- 2. Recruiting Slots -->
                <div v-for="slot in party.slots" :key="slot.slotId"
                     @click="selectSlot(slot)"
                     class="border-4 h-40 flex flex-col items-center justify-center p-2 text-center transition-all relative select-none group"
                     :class="[
                        // 상태별 스타일 분기
                        slot.status === 'OPEN' 
                            ? (selectedSlotId === slot.slotId 
                                ? 'bg-white border-[#e74c3c] shadow-[0_0_15px_rgba(231,76,60,0.5)] scale-105 cursor-pointer dark:bg-[#272729] dark:border-red-500' 
                                : 'bg-[#dfe6e9] border-dashed border-[#7f8c8d] hover:bg-white hover:scale-105 cursor-pointer dark:bg-[#202022] dark:border-[#555] dark:hover:bg-[#272729] dark:hover:border-blue-400')
                            : 'bg-[#2ecc71] border-black cursor-not-allowed opacity-80 dark:bg-[#238636] dark:border-[#343536]'
                     ]">
                    
                    <!-- Case A: 모집 중 -->
                    <template v-if="slot.status === 'OPEN'">
                        <div class="text-4xl font-bold text-gray-400 mb-1 dark:text-[#555]">+</div>
                        <div class="text-xs font-bold text-gray-600 dark:text-[#818384]">RECRUITING</div>
                        <div class="bg-gray-600 text-white text-[10px] px-1.5 py-0.5 mt-2 rounded-sm dark:bg-[#343536]">
                            {{ slot.position }}
                        </div>
                    </template>
                    
                    <!-- Case B: 모집 완료/잠김 -->
                    <template v-else>
                        <div class="text-3xl mb-2">🧙‍♂️</div>
                        <div class="text-xs font-bold text-white drop-shadow-md">Player</div>
                        <div class="bg-black/20 text-white text-[10px] px-1.5 py-0.5 mt-1 rounded-sm">
                            {{ slot.position }}
                        </div>
                        <div class="text-[10px] text-white mt-1 font-bold animate-pulse">READY</div>
                    </template>
                </div>
            </div>

            <!-- Content & Actions -->
            <div class="flex flex-col md:flex-row gap-4 h-auto min-h-[150px]">
                
                <!-- 1. 메시지 표시/입력 영역 -->
                <div class="flex-1 bg-white border-4 border-black p-4 text-sm font-bold leading-relaxed
                            dark:bg-[#1A282D] dark:border-[#343536] dark:text-[#D7DADC]">
                    
                    <!-- Case A: 슬롯 미선택 (파티장 글 표시) -->
                    <template v-if="!selectedSlotId">
                        <div class="text-blue-600 dark:text-blue-400 mb-2">[SYSTEM] Party created by {{ party.leaderNickname }}.</div>
                        <div class="whitespace-pre-wrap">{{ party.content }}</div>
                        <div class="mt-4 text-gray-400 text-xs animate-pulse">
                            >> 지원하려면 위에서 빈 슬롯(OPEN)을 선택하세요.
                        </div>
                    </template>

                    <!-- Case B: 슬롯 선택 (지원 메시지 입력창) -->
                    <div v-else class="flex flex-col h-full gap-2">
                        <div class="text-blue-600 dark:text-blue-400 mb-1">
                            [APPLY] <span class="text-black dark:text-white">To. {{ party.leaderNickname }}</span>
                        </div>
                        <textarea v-model="applyMessage" 
                                  class="w-full h-full resize-none outline-none bg-transparent dark:text-white text-sm placeholder-gray-400"
                                  placeholder="파티장에게 나를 어필해보세요!"></textarea>
                    </div>
                </div>
                
                <!-- 2. 액션 버튼 -->
                <div class="w-full md:w-1/3 flex flex-col gap-2">
                    <button @click="handleApply"
                            :disabled="!selectedSlotId"
                            class="flex-1 border-4 border-black p-3 font-bold shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] transition-all
                                   disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:border-gray-500 disabled:shadow-none
                                   bg-[#2ecc71] text-white hover:bg-[#27ae60]
                                   dark:bg-[#238636] dark:border-[#343536] dark:hover:bg-[#2ea043] dark:shadow-none">
                        파티 신청
                    </button>
                    <button @click="router.push('/')"
                            class="h-12 border-4 border-black p-3 font-bold shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] transition-colors
                                   bg-[#e74c3c] text-white hover:bg-[#c0392b]
                                   dark:bg-[#D93A00] dark:border-[#343536] dark:hover:bg-[#C83500] dark:shadow-none">
                        나가기
                    </button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

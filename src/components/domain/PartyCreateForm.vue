<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { partyApi, type PartyCreateReqDTO, type PartyUpdateReqDTO, type PartySlotUpdateDTO } from '../../api/partyApi';
import { POSITION_OPTIONS, TECH_PRESETS } from '../../constants/common';

/**
 * PartyCreateForm.vue
 * - 파티(퀘스트)를 생성하거나 수정하는 폼 컴포넌트입니다.
 * - props.partyId가 존재하면 [수정 모드], 없으면 [생성 모드]로 동작합니다.
 */

const props = defineProps({
    partyId: {
        type: Number,
        required: false
    } // [New] 수정 모드 식별자
});

const router = useRouter();
const MAX_SLOTS = 20;
const MAX_LINKS = 10; // 링크 최대 개수

// 폼 데이터 상태 (수정을 고려하여 UpdateDTO 사용)
const form = ref<PartyUpdateReqDTO>({
    title: '',
    content: '',
    slots: [],
    linkList: []
});

const positionOptions = POSITION_OPTIONS;

// 현재 입력 중인 슬롯 상태 (UI용 임시 저장소)
const currentSlot = ref<PartySlotUpdateDTO>({
    position: 'BACKEND', 
    techStacks: []
});

// [Computed] 현재 포지션에 맞는 추천 기술 스택 목록
const availableTechs = computed(() => {
    return TECH_PRESETS[currentSlot.value.position] || [];
});

/** 폼 초기화 함수 (생성 모드 진입 시) */
const resetForm = () => {
    form.value = {
        title: '',
        content: '',
        slots: [],
        linkList: []
    };
    currentSlot.value = {
        position: 'BACKEND',
        techStacks: []
    };
};

/** 기존 파티 정보 로드 (수정 모드 진입 시) */
const loadPartyDetail = async (id: number) => {
    try {
        const data = await partyApi.getPartyDetail(id);
        
        form.value.title = data.title;
        form.value.content = data.content;
        
        // [수정] slotId와 status를 포함하여 매핑 (기존 슬롯 식별 및 상태 확인용)
        form.value.slots = data.slots.map(s => ({
            slotId: s.slotId, 
            position: s.position,
            status: s.status, // LOCKED 상태 확인용
            techStacks: s.techStacks || [] 
        }));
        
        form.value.linkList = data.linkList || [];
    } catch (e) {
        console.error('파티 정보 로드 실패:', e);
        alert('파티 정보를 불러올 수 없습니다.');
        router.push('/my-party');
    }
};

/**
 * [Watch] partyId 변경 감지 (생성 <-> 수정 모드 전환 대응)
 * - Vue Router가 컴포넌트를 재사용하더라도 상태를 확실하게 변경합니다.
 */
watch(() => props.partyId, (newId) => {
    if (newId) {
        loadPartyDetail(newId);
    } else {
        resetForm();
    }
}, { immediate: true });

// onMounted 제거 (watch의 immediate: true가 대신함)

/** 기술 스택 토글 (Chip 선택/해제) */
const toggleTech = (tech: string) => {
    const index = currentSlot.value.techStacks.indexOf(tech);
    if (index === -1) {
        currentSlot.value.techStacks.push(tech);
    } else {
        currentSlot.value.techStacks.splice(index, 1);
    }
};

/** 슬롯 추가 핸들러 */
const addSlot = () => {
    if (form.value.slots.length >= MAX_SLOTS) {
        alert(`모집 슬롯은 최대 ${MAX_SLOTS}개까지만 생성할 수 있습니다.`);
        return;
    }
    // 깊은 복사로 현재 입력값 저장
    form.value.slots.push(JSON.parse(JSON.stringify(currentSlot.value)));
    // 입력창 초기화
    currentSlot.value.techStacks = [];
};

/** 
 * 슬롯 삭제 핸들러 
 * - LOCKED(승인 완료) 상태인 슬롯도 삭제 허용 (파티장 권한)
 * - 단, 강력한 경고 메시지 표시
 */
const removeSlot = (index: number) => {
    const slot = form.value.slots[index];
    if (!slot) return;

    let message = '슬롯을 삭제하시겠습니까?\n대기 중인 지원자가 있다면 해당 지원 내역도 함께 삭제됩니다.';

    // LOCKED 슬롯 삭제 시 경고 강화
    if (slot.status === 'LOCKED') {
        message = '⚠️ 경고: 이미 멤버가 확정된 슬롯입니다!\n삭제 시 해당 멤버와의 매칭 정보가 영구적으로 사라집니다.\n정말 삭제하시겠습니까?';
    }

    if (confirm(message)) {
        form.value.slots.splice(index, 1);
    }
};

// [New] 링크 추가 핸들러
const addLink = () => {
    if (form.value.linkList.length >= MAX_LINKS) {
        alert(`초대 링크는 최대 ${MAX_LINKS}개까지만 등록할 수 있습니다.`);
        return;
    }
    form.value.linkList.push({ label: '', url: '' });
};

const removeLink = (index: number) => {
    form.value.linkList.splice(index, 1);
};

// [New] 링크 라벨 입력 필터링 (공백/특수문자 차단)
const handleLinkLabelInput = (e: Event, index: number) => {
    // 해당 인덱스의 요소가 존재하는지 확인 (안전성 확보)
    if (!form.value.linkList[index]) return;

    const target = e.target as HTMLInputElement;
    // 한글(자음/모음 포함), 영문, 숫자만 허용 (Regex)
    let val = target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]/g, '');
    
    // 길이 제한 (20자)
    if (val.length > 20) val = val.slice(0, 20);
    
    if (val !== target.value) {
        form.value.linkList[index].label = val;
        target.value = val;
    } else {
        form.value.linkList[index].label = val;
    }
};

/**
 * 취소/돌아가기 핸들러
 */
const handleCancel = () => {
    // 무조건 '내가 만든 퀘스트' 목록으로 이동
    router.push('/my-party?tab=CREATED');
};

/**
 * 폼 제출 핸들러 (생성/수정 분기)
 */
const handleSubmit = async () => {
    try {
        if (form.value.slots.length === 0) {
            alert('최소 1명 이상의 동료를 모집해야 합니다.');
            return;
        }

        if (props.partyId) {
            // [수정 모드] UpdateReqDTO 타입 그대로 전송
            await partyApi.updateParty(props.partyId, form.value);
            alert('퀘스트 정보가 수정되었습니다! ✨');
            router.push(`/party/${props.partyId}`); // 상세 페이지로 이동
        } else {
            // [생성 모드] CreateReqDTO 타입으로 변환 (slotId 제거)
            // TS 에러 방지를 위해 any 캐스팅 혹은 새 객체 생성
            const createReq: PartyCreateReqDTO = {
                title: form.value.title,
                content: form.value.content,
                // slotId, status 등 불필요 속성 제거
                slots: form.value.slots.map(({ slotId, status, ...rest }) => rest),
                linkList: form.value.linkList
            };

            const res = await partyApi.createParty(createReq);
            console.log('Create Response:', res); // 디버깅용 로그

            if (res && res.partyId) {
                alert('새로운 퀘스트가 생성되었습니다! 🎉');
                router.push(`/party/${res.partyId}`);
            } else {
                console.error('파티 ID를 반환받지 못했습니다.', res);
                alert('파티 생성에는 성공했으나, 상세 페이지로 이동할 수 없습니다.');
                router.push('/');
            }
        }

    } catch (e: any) {
        console.error(e);
        const errorMsg = e.response?.data?.message || '처리에 실패했습니다.';
        alert(errorMsg);
    }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
      
      <!-- 1. 퀘스트 제목 -->
      <div>
          <label class="block text-sm font-bold mb-2 dark:text-[#D7DADC]">
              퀘스트 제목 <span class="text-red-500">*</span>
          </label>
          <input v-model="form.title" type="text" required minlength="5" maxlength="100"
                 placeholder="예: 사이드 프로젝트 백엔드 개발자 구합니다!"
                 class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors
                        dark:bg-[#272729] dark:border-[#343536] dark:text-white dark:focus:ring-blue-600" />
      </div>

      <!-- 2. 상세 내용 -->
      <div>
          <label class="block text-sm font-bold mb-2 dark:text-[#D7DADC]">
              퀘스트 상세 내용 <span class="text-red-500">*</span>
          </label>
          <textarea v-model="form.content" rows="6" required
                    placeholder="프로젝트 주제, 예상 기간, 기술 스택 등을 자세히 적어주세요."
                    class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors resize-y
                           dark:bg-[#272729] dark:border-[#343536] dark:text-white dark:focus:ring-blue-600"></textarea>
      </div>

      <!-- 3. 모집 슬롯 설정 -->
      <div class="p-5 bg-gray-50 rounded-xl border border-gray-200 dark:bg-[#202022] dark:border-[#343536]">
          <label class="block text-sm font-bold mb-3 dark:text-[#D7DADC]">
              모집할 동료 구성 <span class="text-red-500">*</span>
          </label>
          
          <!-- 입력 영역 -->
          <div class="flex flex-col gap-4 mb-6">
              <div class="w-full">
                  <label class="text-xs font-bold text-gray-500 mb-1 block">포지션</label>
                  <select v-model="currentSlot.position" 
                          @change="currentSlot.techStacks = []"
                          class="w-full p-2.5 border rounded-lg dark:bg-[#272729] dark:border-[#343536] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                      <option v-for="opt in positionOptions" :key="opt.value" :value="opt.value">
                          {{ opt.label }}
                      </option>
                  </select>
              </div>

              <div class="w-full">
                  <label class="text-xs font-bold text-gray-500 mb-2 block">
                      요구 기술 스택 (클릭하여 선택)
                  </label>
                  
                  <div class="flex flex-wrap gap-2 mb-3">
                      <button v-for="tech in availableTechs" :key="tech"
                              type="button"
                              @click="toggleTech(tech)"
                              class="px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200"
                              :class="currentSlot.techStacks.includes(tech)
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-105'
                                  : 'bg-white border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 dark:bg-[#272729] dark:border-[#555] dark:text-[#D7DADC]'">
                          {{ tech }}
                          <span v-if="currentSlot.techStacks.includes(tech)" class="ml-1">✓</span>
                      </button>
                  </div>
                  
                  <div v-if="currentSlot.techStacks.length > 0" class="mt-3 flex flex-wrap gap-1.5 p-3 bg-white border rounded-lg dark:bg-[#272729] dark:border-[#343536]">
                      <span class="text-xs text-gray-400 self-center mr-1">선택됨:</span>
                      <span v-for="(tech, idx) in currentSlot.techStacks" :key="idx"
                            class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-bold flex items-center gap-1 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                          {{ tech }}
                          <button type="button" @click="toggleTech(tech)" class="hover:text-red-500 font-normal">×</button>
                      </span>
                  </div>
                  <div class="mt-2 text-[10px] text-gray-400">
                      * 원하는 기술 스택이 없다면 '기타'를 선택하거나 상세 내용에 적어주세요.
                  </div>
              </div>

              <!-- 추가 버튼 (20개 초과 시 disabled) -->
              <button type="button" @click="addSlot" 
                      :disabled="form.slots.length >= MAX_SLOTS"
                      class="w-full py-3 bg-gray-800 text-white hover:bg-gray-900 rounded-lg font-bold transition-colors shadow-md flex items-center justify-center gap-2 dark:bg-[#343536] dark:hover:bg-[#4a4b4c] disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                  </svg>
                  {{ form.slots.length >= MAX_SLOTS ? '슬롯 가득 참' : '이 구성으로 모집 슬롯 추가' }}
              </button>
          </div>

          <!-- 추가된 슬롯 리스트 (수정) -->
          <div class="space-y-3">
              <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wide">생성된 슬롯 목록 ({{ form.slots.length }} / {{ MAX_SLOTS }})</h4>
              
              <div v-for="(slot, index) in form.slots" :key="index"
                   class="flex items-center justify-between p-4 border rounded-lg shadow-sm transition-colors"
                   :class="slot.status === 'LOCKED' 
                       ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800' 
                       : 'bg-white border-gray-200 hover:border-blue-300 dark:bg-[#272729] dark:border-[#343536]'">
                  
                  <div class="flex flex-col gap-2">
                      <div class="flex items-center gap-2">
                          <span class="px-2 py-0.5 rounded text-xs font-bold border"
                                :class="slot.status === 'LOCKED' 
                                    ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'">
                              {{ slot.position }}
                          </span>
                          <span v-if="slot.status === 'LOCKED'" class="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                              멤버 확정됨
                          </span>
                          <span v-else class="text-sm font-bold text-gray-900 dark:text-[#D7DADC]">개발자 모집</span>
                      </div>
                      
                      <div class="flex flex-wrap gap-1">
                          <span v-if="slot.techStacks.length === 0" class="text-xs text-gray-400">(기술 스택 무관)</span>
                          <span v-else v-for="t in slot.techStacks" :key="t" 
                                class="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                              {{ t }}
                          </span>
                      </div>
                  </div>
                  
                                    <button type="button" @click="removeSlot(index)" 
                  
                                            class="p-2 rounded-full transition-colors text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-[#343536]"
                  
                                            title="삭제">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                  </button>
              </div>
              
              <div v-if="form.slots.length === 0" class="py-8 border-2 border-dashed border-gray-200 rounded-lg text-center dark:border-[#343536]">
                  <p class="text-sm text-gray-400">아직 모집할 슬롯이 없습니다.</p>
                  <p class="text-xs text-gray-300 mt-1">위에서 포지션과 기술 스택을 선택하고 '추가' 버튼을 눌러주세요.</p>
              </div>
          </div>
      </div>

      <!-- 4. 멤버 전용 초대 링크 (동적 리스트) -->
      <div class="p-5 bg-blue-50 rounded-xl border border-blue-100 dark:bg-blue-900/10 dark:border-blue-800">
          <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                  <span class="text-lg">🔒</span>
                  <label class="text-sm font-bold text-blue-800 dark:text-blue-300">
                      멤버 전용 링크 ({{ form.linkList.length }} / {{ MAX_LINKS }})
                  </label>
              </div>
              <!-- 추가 버튼 (10개 초과 시 disabled) -->
              <button type="button" @click="addLink" 
                      :disabled="form.linkList.length >= MAX_LINKS"
                      class="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors font-bold shadow-sm dark:bg-blue-800 dark:text-blue-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  + 링크 추가
              </button>
          </div>
          
          <p class="text-xs text-blue-600 mb-4 dark:text-blue-400">
              파티원에게만 공개되는 정보입니다. (예: 라벨 '디스코드', URL 'https://discord.gg/...')
          </p>

          <div class="space-y-2">
              <div v-for="(link, index) in form.linkList" :key="index" class="flex gap-2 items-center">
                  <!-- 라벨 입력 (필터링 적용) -->
                  <input :value="link.label" 
                         @input="(e) => handleLinkLabelInput(e, index)"
                         placeholder="라벨 (한글/영문/숫자, 20자)" 
                         class="w-1/3 p-2.5 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm dark:bg-[#272729] dark:border-[#343536] dark:text-white" />
                  
                  <input v-model="link.url" placeholder="초대링크를 입력하세요"
                         class="flex-1 p-2.5 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm dark:bg-[#272729] dark:border-[#343536] dark:text-white" />
                  
                  <button type="button" @click="removeLink(index)" 
                          class="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors">
                      ✕
                  </button>
              </div>
              
              <div v-if="form.linkList.length === 0" class="text-center py-4 text-sm text-blue-400 opacity-60 border border-dashed border-blue-200 rounded-lg dark:border-blue-800/50">
                  등록된 링크가 없습니다. 필요 시 추가해주세요.
              </div>
          </div>
      </div>

      <!-- 제출 및 취소 버튼 -->
      <div class="pt-6 flex gap-3">
          <button type="submit" class="flex-1 btn btn-primary py-3.5 text-lg shadow-lg font-bold rounded-xl">
              {{ partyId ? '퀘스트 수정' : '퀘스트 등록' }}
          </button>
          <button type="button" @click="handleCancel"
                  class="flex-1 btn px-6 py-3.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors dark:bg-[#343536] dark:border-[#555] dark:text-[#D7DADC] dark:hover:bg-[#404142]">
              목록으로
          </button>
      </div>
  </form>
</template>

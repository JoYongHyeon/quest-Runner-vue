<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { partyApi, type PartyCreateReqDTO } from '../../api/partyApi';
import type { Position } from '../../types/Member';

/**
 * PartyCreateForm.vue
 * - 파티 모집(퀘스트 생성)을 위한 폼 컴포넌트입니다.
 * - 제목, 내용, 지역, 그리고 핵심 기능인 '모집 슬롯(Positions)'을 설정합니다.
 */

const router = useRouter();

// 폼 데이터 상태 (DTO와 일치)
const form = ref<PartyCreateReqDTO>({
    title: '',
    content: '',
    region: 'SEOUL', // 기본값
    slots: [] // 모집 슬롯 배열 (Position[])
});

// 슬롯 추가를 위한 임시 선택 값
const selectedPosition = ref<Position>('BACKEND');

/**
 * 슬롯 추가 핸들러
 * - 선택된 포지션(문자열 값)을 슬롯 목록에 추가합니다.
 */
const addSlot = () => {
    // [수정됨] 객체가 아닌 '값'을 직접 push (중괄호 제거)
    form.value.slots.push(selectedPosition.value);
};

/**
 * 슬롯 삭제 핸들러
 * @param index 삭제할 슬롯의 인덱스
 */
const removeSlot = (index: number) => {
    form.value.slots.splice(index, 1);
};

/**
 * 폼 제출 핸들러 (API 호출)
 */
const handleSubmit = async () => {
    try {
        if (form.value.slots.length === 0) {
            alert('최소 1명 이상의 동료를 모집해야 합니다! 🛡️');
            return;
        }

        // 1. 파티 생성 API 호출
        await partyApi.createParty(form.value);
        
        alert('새로운 퀘스트가 생성되었습니다! 🎉');
        
        // 2. 메인 페이지로 이동 (추후 상세 페이지로 변경 예정)
        router.push('/');
        
    } catch (e) {
        console.error(e);
        alert('퀘스트 생성에 실패했습니다.');
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

      <!-- 2. 활동 지역 -->
      <div>
          <label class="block text-sm font-bold mb-2 dark:text-[#D7DADC]">
              활동 지역 <span class="text-red-500">*</span>
          </label>
          <select v-model="form.region" required
                  class="w-full p-3 border rounded-lg dark:bg-[#272729] dark:border-[#343536] dark:text-white">
              <option value="SEOUL">서울</option>
              <option value="GYEONGGI">경기/인천</option>
              <option value="DAEJEON">대전/충청</option>
              <option value="BUSAN">부산/경남</option>
              <option value="GWANGJU">광주/전라</option>
              <option value="ETC">기타 (온라인 포함)</option>
          </select>
      </div>

      <!-- 3. 상세 내용 -->
      <div>
          <label class="block text-sm font-bold mb-2 dark:text-[#D7DADC]">
              퀘스트 상세 내용 <span class="text-red-500">*</span>
          </label>
          <textarea v-model="form.content" rows="6" required
                    placeholder="프로젝트 주제, 예상 기간, 기술 스택 등을 자세히 적어주세요."
                    class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors
                           dark:bg-[#272729] dark:border-[#343536] dark:text-white dark:focus:ring-blue-600"></textarea>
      </div>

      <!-- 4. 모집 슬롯 (핵심 기능) -->
      <div class="p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-[#202022] dark:border-[#343536]">
          <label class="block text-sm font-bold mb-3 dark:text-[#D7DADC]">
              모집할 동료 (슬롯) <span class="text-red-500">*</span>
          </label>
          
          <div class="flex gap-2 mb-4">
              <select v-model="selectedPosition" 
                      class="p-2 border rounded dark:bg-[#272729] dark:border-[#343536] dark:text-white">
                  <option value="BACKEND">백엔드</option>
                  <option value="FRONTEND">프론트엔드</option>
                  <option value="DESIGN">디자이너</option>
                  <option value="PM">기획자(PM)</option>
              </select>
              <button type="button" @click="addSlot" 
                      class="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded font-bold transition-colors
                             dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50">
                  + 추가
              </button>
          </div>

          <!-- 추가된 슬롯 목록 -->
          <div class="flex flex-wrap gap-2">
              <div v-for="(slot, index) in form.slots" :key="index"
                   class="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-full shadow-sm select-none
                          dark:bg-[#272729] dark:border-[#343536]">
                  
                  <!-- [수정됨] slot 자체가 문자열이므로 바로 출력 -->
                  <span class="text-sm font-bold dark:text-[#D7DADC]">{{ slot }}</span>
                  
                  <!-- 삭제 버튼 -->
                  <button type="button" @click="removeSlot(index)" 
                          class="text-gray-400 hover:text-red-500 transition-colors font-bold ml-1">
                      ✕
                  </button>
              </div>
              
              <span v-if="form.slots.length === 0" class="text-sm text-gray-500 dark:text-[#818384] py-2">
                  아직 모집할 동료가 없습니다. 슬롯을 추가해주세요!
              </span>
          </div>
      </div>

      <!-- 제출 버튼 -->
      <div class="pt-4">
          <button type="submit" class="w-full btn btn-primary py-3 text-lg shadow-lg">
              퀘스트 등록 완료 ⚔️
          </button>
      </div>
  </form>
</template>
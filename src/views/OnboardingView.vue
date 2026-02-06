<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { memberApi, type OnboardingReqDTO } from '../api/memberApi';

/**
 * OnboardingView.vue
 * - 회원가입 직후(PENDING_PROFILE), 필수 정보를 입력받는 페이지
 * - 닉네임, 포지션, 지역, 기술 스택을 입력받아 'ACTIVE' 상태로 전환
 */

const router = useRouter();
const { currentUser, fetchMyProfile } = useAuth();

// 입력 폼 데이터 (DTO 구조와 일치)
const form = ref<OnboardingReqDTO>({
    nickname: '',
    position: 'BACKEND', // 기본값 설정
    region: 'SEOUL',
    techStacks: [],
    intro: '',
    gitUrl: '',
    blogUrl: '',
    resumeLink: ''
});

// 기술 스택 선택지 (Mock Data) -> 추후 공통 코드로 분리 권장
const techOptions = ['Java', 'Spring', 'Python', 'JavaScript', 'Vue', 'React', 'Figma', 'Docker', 'AWS'];

/**
 * 컴포넌트 마운트 시 초기화 로직
 */
onMounted(() => {
    if (currentUser.value) {
        form.value.nickname = currentUser.value.nickname || '';
        // 필요한 경우 다른 필드도 초기화
    }
});

/**
 * 폼 제출 처리
 */
const handleSubmit = async () => {
    try {
        // 클라이언트 측 유효성 검사
        if (form.value.techStacks.length === 0) {
            alert('기술 스택을 최소 1개 이상 선택해주세요.');
            return;
        }

        // 1. 온보딩 API 호출
        await memberApi.completeOnboarding(form.value);
        
        // 2. 변경된 정보(ACTIVE 상태 등)를 다시 받아옴
        await fetchMyProfile();

        alert('모험 준비가 완료되었습니다! 🎉');
        
        // 3. 메인 페이지로 이동
        router.push('/');
        
    } catch (e) {
        console.error(e);
        alert('정보 저장에 실패했습니다. 다시 시도해주세요.');
    }
};
</script>

<template>
  <div class="max-w-2xl mx-auto py-10 px-4">
    <!-- 카드 컨테이너 -->
    <div class="card p-8 dark:bg-[#1A282D] dark:border-[#343536]">
      
      <!-- 헤더 -->
      <h2 class="text-2xl font-bold mb-2 text-center dark:text-[#D7DADC]">모험가 등록</h2>
      <p class="text-center text-gray-500 mb-8 dark:text-[#818384]">
        팀 매칭을 위해 프로필을 완성해주세요.
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <!-- 1. 닉네임 입력 -->
        <div>
            <label class="block text-sm font-bold mb-2 dark:text-[#D7DADC]">닉네임 <span class="text-red-500">*</span></label>
            <input v-model="form.nickname" type="text" required 
                   placeholder="사용하실 닉네임을 입력하세요"
                   class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none
                          dark:bg-[#272729] dark:border-[#343536] dark:text-white dark:focus:ring-blue-600" />
        </div>

        <!-- 2. 포지션 & 지역 (Grid Layout) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-bold mb-2 dark:text-[#D7DADC]">주 포지션 <span class="text-red-500">*</span></label>
                <select v-model="form.position" 
                        class="w-full p-2 border rounded dark:bg-[#272729] dark:border-[#343536] dark:text-white">
                    <option value="BACKEND">백엔드 개발자</option>
                    <option value="FRONTEND">프론트엔드 개발자</option>
                    <option value="DESIGN">디자이너</option>
                    <option value="PM">기획자 (PM)</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-bold mb-2 dark:text-[#D7DADC]">활동 지역 <span class="text-red-500">*</span></label>
                <select v-model="form.region" 
                        class="w-full p-2 border rounded dark:bg-[#272729] dark:border-[#343536] dark:text-white">
                    <option value="SEOUL">서울</option>
                    <option value="GYEONGGI">경기/인천</option>
                    <option value="DAEJEON">대전/충남</option>
                    <option value="BUSAN">부산/경남</option>
                    <option value="ETC">기타 (온라인)</option>
                </select>
            </div>
        </div>

        <!-- 3. 기술 스택 선택 (Tags) -->
        <div>
            <label class="block text-sm font-bold mb-2 dark:text-[#D7DADC]">기술 스택 (1개 이상) <span class="text-red-500">*</span></label>
            <div class="flex flex-wrap gap-2">
                <label v-for="tech in techOptions" :key="tech" 
                       class="cursor-pointer border px-3 py-1.5 rounded-full text-sm font-medium transition-all select-none"
                       :class="form.techStacks.includes(tech) 
                           ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700' 
                           : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-[#272729] dark:text-[#818384] dark:border-[#343536] dark:hover:bg-[#333335]'">
                    <input type="checkbox" :value="tech" v-model="form.techStacks" class="hidden">
                    {{ tech }}
                </label>
            </div>
        </div>

        <!-- 4. 한줄 소개 -->
        <div>
            <label class="block text-sm font-bold mb-2 dark:text-[#D7DADC]">한줄 소개</label>
            <input v-model="form.intro" type="text" 
                   placeholder="나를 표현하는 짧은 문장을 입력해주세요."
                   class="w-full p-2 border rounded dark:bg-[#272729] dark:border-[#343536] dark:text-white" />
        </div>

        <!-- 제출 버튼 -->
        <button type="submit" class="w-full btn btn-primary py-3 text-base shadow-lg">
            모험 시작하기 ⚔️
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import { memberApi, type OnboardingReqDTO } from '../../api/memberApi';
import type { Position } from '../../types/Member';
import { POSITION_OPTIONS, ALL_TECH_STACKS } from '../../constants/common'; // [New] 공통 상수 Import

const router = useRouter();
const { currentUser, fetchMyProfile } = useAuth();

// 입력 폼 데이터
const form = ref<OnboardingReqDTO>({
    nickname: '',
    position: 'BACKEND' as Position,
    techStacks: [],
    intro: '',
    gitUrl: '',
    blogUrl: '',
    resumeLink: ''
});

// [Refactor] 공통 상수 사용
const positionOptions = POSITION_OPTIONS;
const techOptions = ALL_TECH_STACKS;

// 닉네임 중복 확인 상태
const isNicknameChecked = ref(false);
const nicknameError = ref('');
const isNicknameLoading = ref(false);

// 초기값 바인딩
onMounted(() => {
    if (currentUser.value) {
        form.value.nickname = currentUser.value.nickname || '';
        form.value.position = currentUser.value.position || 'BACKEND';
        form.value.techStacks = currentUser.value.techStacks || [];
        form.value.intro = currentUser.value.intro || '';
        form.value.gitUrl = currentUser.value.gitUrl || '';
        form.value.blogUrl = currentUser.value.blogUrl || '';
        form.value.resumeLink = currentUser.value.resumeLink || '';
        
        if (currentUser.value.nickname) {
            isNicknameChecked.value = true;
        }
    }
});

// 닉네임 입력 핸들러 (강력한 필터링 + 길이 12자)
const handleNicknameInput = (e: Event) => {
    isNicknameChecked.value = false;
    const target = e.target as HTMLInputElement;
    
    // 허용되지 않은 문자(특수문자, 공백, 자음/모음 낱자) 제거
    let val = target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]/g, '');
    
    // 최대 길이 제한 (12자)
    if (val.length > 12) {
        val = val.slice(0, 12);
    }

    if (val !== target.value) {
        form.value.nickname = val;
        target.value = val;
    } else {
        form.value.nickname = val;
    }

    if (val.length > 0 && val.length < 2) {
        nicknameError.value = '닉네임은 최소 2글자 이상이어야 합니다.';
    } else {
        nicknameError.value = '';
    }
};

const isCompleteHangul = (str: string) => {
    const incompleteRegex = /[ㄱ-ㅎㅏ-ㅣ]/;
    return !incompleteRegex.test(str);
};

const checkNickname = async () => {
    if (!form.value.nickname || form.value.nickname.length < 2) {
        nicknameError.value = '닉네임은 2글자 이상이어야 합니다.';
        return;
    }
    
    if (!isCompleteHangul(form.value.nickname)) {
        nicknameError.value = '닉네임은 완성된 한글이어야 합니다. (자음/모음 불가)';
        return;
    }
    
    if (currentUser.value?.nickname === form.value.nickname) {
        isNicknameChecked.value = true;
        nicknameError.value = '';
        return;
    }

    try {
        isNicknameLoading.value = true;
        const data = await memberApi.checkNickname(form.value.nickname);
        
        if (data.isAvailable) {
            isNicknameChecked.value = true;
            nicknameError.value = '';
            alert('사용 가능한 닉네임입니다. ✨');
        } else {
            isNicknameChecked.value = false;
            nicknameError.value = '이미 사용 중인 닉네임입니다. 😢';
        }
    } catch (e) {
        console.error(e);
        alert('중복 확인 중 오류가 발생했습니다.');
    } finally {
        isNicknameLoading.value = false;
    }
};

const handleSubmit = async () => {
    if (!isCompleteHangul(form.value.nickname)) {
        alert('닉네임은 완성된 한글이어야 합니다. (자음/모음 단독 불가)');
        return;
    }

    if (currentUser.value?.nickname !== form.value.nickname && !isNicknameChecked.value) {
        alert('닉네임 중복 확인을 해주세요.');
        return;
    }
    
    if (nicknameError.value) {
        alert('닉네임을 확인해주세요.');
        return;
    }

    try {
        if (form.value.techStacks.length === 0) {
            alert('기술 스택을 최소 1개 이상 선택해주세요.');
            return;
        }

        const previousStatus = currentUser.value?.status;

        await memberApi.completeMyProfile(form.value);
        await fetchMyProfile();
        
        const newStatus = currentUser.value?.status;

        if (previousStatus === 'PENDING_PROFILE' && newStatus === 'ACTIVE') {
            alert('모험가 등록이 완료되었습니다! 🎉\n이제 파티를 생성하거나 지원할 수 있습니다.');
            await router.push('/'); 
        } else {
            alert('프로필이 성공적으로 저장되었습니다.');
        }

    } catch (e) {
        console.error('프로필 저장 실패:', e);
        alert('저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
};
</script>

<template>
  <div class="max-w-2xl mx-auto py-12 px-4">
    <div class="bg-white dark:bg-[#1A282D] rounded-xl shadow-lg border border-gray-200 dark:border-[#343536] overflow-hidden">
      
      <div class="px-8 py-6 border-b border-gray-200 dark:border-[#343536] bg-gray-50 dark:bg-[#202022]">
          <h2 class="text-xl font-bold text-gray-900 dark:text-[#D7DADC]">내 프로필 설정</h2>
          <p class="text-sm text-gray-500 dark:text-[#818384] mt-1">동료들에게 보여질 나의 정보를 관리하세요.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- 1. 닉네임 입력 -->
            <div class="space-y-2">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wide dark:text-[#818384]">
                    닉네임 <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-2 items-center">
                    <input :value="form.nickname" @input="handleNicknameInput" type="text" required 
                           class="flex-1 min-w-0 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#343536] bg-white dark:bg-[#272729] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" 
                           placeholder="한글/영문/숫자 (2~12자)" />
                    
                    <button type="button" @click="checkNickname" 
                            :disabled="isNicknameLoading || !!nicknameError || form.nickname.length < 2"
                            class="shrink-0 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-[#343536] dark:hover:bg-[#404142] text-gray-700 dark:text-[#D7DADC] rounded-lg font-bold text-xs whitespace-nowrap transition-colors border border-gray-300 dark:border-[#555] disabled:opacity-50"
                            :class="{'text-green-600 dark:text-green-400 border-green-500': isNicknameChecked}">
                        {{ isNicknameLoading ? '확인 중...' : (isNicknameChecked ? '✔ 사용 가능' : '중복 확인') }}
                    </button>
                </div>
                <p v-if="nicknameError" class="text-xs text-red-500 mt-1 ml-1">{{ nicknameError }}</p>
                <p class="text-[10px] text-gray-400 mt-1 ml-1 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    한 번 설정한 닉네임은 변경이 어려울 수 있습니다.
                </p>
            </div>
            
            <!-- 2. 주 포지션 -->
            <div class="space-y-2 relative z-0">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wide dark:text-[#818384]">
                    주 포지션 <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <select v-model="form.position" 
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#343536] bg-white dark:bg-[#272729] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 appearance-none transition-all cursor-pointer outline-none">
                        <option v-for="opt in positionOptions" :key="opt.value" :value="opt.value">
                            {{ opt.label }}
                        </option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- 2. 기술 스택 -->
        <div class="space-y-2">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wide dark:text-[#818384]">
                기술 스택 <span class="text-red-500">*</span>
            </label>
            <div class="flex flex-wrap gap-2 p-4 rounded-lg border border-gray-200 dark:border-[#343536] bg-gray-50 dark:bg-[#202022]">
                <label v-for="tech in techOptions" :key="tech" 
                       class="cursor-pointer px-3 py-1.5 rounded-md text-sm font-medium transition-all select-none border"
                       :class="form.techStacks.includes(tech) 
                           ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-105' 
                           : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-100 dark:bg-[#272729] dark:border-[#555] dark:text-[#D7DADC] dark:hover:bg-[#333]'">
                    <input type="checkbox" :value="tech" v-model="form.techStacks" class="hidden">
                    {{ tech }}
                </label>
            </div>
        </div>

        <!-- 3. 자기소개 -->
        <div class="space-y-2">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wide dark:text-[#818384]">자기소개</label>
            <textarea v-model="form.intro" rows="6" maxlength="1000"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#343536] bg-white dark:bg-[#272729] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-y scrollbar-hide" 
                      placeholder="자신의 경험, 관심사, 협업 스타일 등을 자유롭게 적어주세요. (최대 1000자)"></textarea>
            <div class="text-right text-xs text-gray-400">
                {{ form.intro?.length || 0 }} / 1000
            </div>
        </div>

        <!-- 4. 링크 정보 -->
        <div class="space-y-3 pt-2">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wide dark:text-[#818384]">소셜 링크 (선택)</label>
            
            <div class="flex items-center gap-3 group">
                <div class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-[#272729] text-gray-600 dark:text-[#D7DADC]">
                    <!-- GitHub Icon -->
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 1.98.135 2.94.39 2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </div>
                <input v-model="form.gitUrl" type="url" placeholder="GitHub URL" 
                       class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-[#343536] bg-white dark:bg-[#272729] text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none" />
            </div>
            
            <div class="flex items-center gap-3 group">
                <div class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-[#272729] text-gray-600 dark:text-[#D7DADC]">
                    <!-- Blog Icon -->
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                </div>
                <input v-model="form.blogUrl" type="url" placeholder="Blog URL (Velog, Tistory...)" 
                       class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-[#343536] bg-white dark:bg-[#272729] text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none" />
            </div>

            <div class="flex items-center gap-3 group">
                <div class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-[#272729] text-gray-600 dark:text-[#D7DADC]">
                    <!-- Resume Icon -->
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <input v-model="form.resumeLink" type="url" placeholder="이력서/포트폴리오 링크" 
                       class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-[#343536] bg-white dark:bg-[#272729] text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none" />
            </div>
        </div>

        <!-- Footer Actions -->
        <div class="pt-6 border-t border-gray-200 dark:border-[#343536] flex justify-end">
            <button type="submit" 
                    class="btn bg-[#FF4500] hover:bg-[#ff5722] text-white font-bold py-2.5 px-8 rounded-full shadow-lg transform active:scale-95 transition-all text-sm border-none">
                저장하기
            </button>
        </div>

      </form>
    </div>
  </div>
</template>
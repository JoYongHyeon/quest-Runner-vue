<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth';

/**
 * OAuthRedirectView.vue
 * - OAuth2 로그인 성공 후 백엔드로부터 리다이렉트되는 페이지입니다.
 * - URL 쿼리 파라미터에서 accessToken 등을 추출하여 저장합니다.
 */

const router = useRouter();
const route = useRoute();
const { loginSuccess } = useAuth();

onMounted(async () => {
    // 1. URL 쿼리 파라미터 추출
    const accessToken = route.query.accessToken as string;

    if (accessToken) {
        // 2. 로그인 성공 처리
        await loginSuccess(accessToken);

        // 3. 메인 페이지로 이동 (Replace로 뒤로가기 방지)
        await router.replace('/');
    } else {
        // 토큰이 없으면 로그인 실패로 간주
        alert('로그인 처리에 실패했습니다.');
        await router.replace('/login');
    }
});
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#0B1416] text-white">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
    <h2 class="text-xl font-bold">로그인 처리 중...</h2>
    <p class="text-gray-400 mt-2">잠시만 기다려주세요.</p>
  </div>
</template>

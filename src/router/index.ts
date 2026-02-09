import { createRouter, createWebHistory } from 'vue-router';
import PartyListView from '../views/party/PartyListView.vue';
import OAuthRedirectView from '../views/auth/OAuthRedirectView.vue';
import OnboardingView from '../views/auth/OnboardingView.vue';
import CreateContentView from '../views/content/CreateContentView.vue';
import PartyDetailView from '../views/party/PartyDetailView.vue';
import MyPartyView from '../views/party/MyPartyView.vue';
import { useAuth } from '../composables/useAuth';

// Vue Router의 Meta 필드 타입을 확장합니다. (Layout 지정용)
declare module 'vue-router' {
  interface RouteMeta {
    layout?: 'DefaultLayout' | 'AuthLayout';
    hideRightSidebar?: boolean; // 우측 사이드바 숨김 여부
  }
}

/**
 * Vue Router 설정
 * - URL 경로와 컴포넌트를 매핑합니다.
 * - meta.layout 속성을 통해 페이지별 레이아웃을 지정합니다.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // [메인 페이지] - 기본 레이아웃 (헤더/사이드바 포함)
    {
      path: '/',
      name: 'home',
      component: PartyListView,
      meta: { layout: 'DefaultLayout' }
    },
    // [OAuth2 리다이렉트 페이지] - 빈 레이아웃 (빠른 처리)
    {
      path: '/oauth2/redirect',
      name: 'oauth-redirect',
      component: OAuthRedirectView,
      meta: { layout: 'AuthLayout' } 
    },
    // [온보딩 페이지] - 기본 레이아웃
    {
      path: '/onboarding',
      name: 'onboarding',
      component: OnboardingView,
      meta: { layout: 'DefaultLayout', hideRightSidebar: true }
    },
    // [파티 모집 등록 페이지]
    {
      path: '/create',
      name: 'create-content',
      component: CreateContentView,
      meta: { layout: 'DefaultLayout', hideRightSidebar: true },
      // [네비게이션 가드] 온보딩(PENDING_PROFILE) 상태면 접근 차단
      beforeEnter: async (_to, _from, next) => {
          const auth = useAuth(); // 객체로 받아서 사용
          
          // 정보가 없으면 로드 시도 (새로고침 직후 등)
          if (!auth.currentUser.value) {
              try {
                  await auth.fetchMyProfile();
              } catch (e) {
                  // 로드 실패 시 홈으로 (로그아웃 처리됨)
                  return next('/'); 
              }
          }

          if (auth.currentUser.value?.status === 'PENDING_PROFILE') {
              alert('모험가 등록(프로필 완성)이 필요합니다.');
              next('/onboarding'); // 온보딩 페이지로 강제 이동
          } else {
              next(); // 통과
          }
      }
    },
    // [파티 상세 페이지]
    {
      path: '/party/:id',
      name: 'party-detail',
      component: PartyDetailView,
      meta: { layout: 'DefaultLayout' }
    },
    // [내 파티 관리 페이지]
    {
      path: '/my-party',
      name: 'my-party',
      component: MyPartyView,
      meta: { layout: 'DefaultLayout' }
    }
  ]
});

export default router;

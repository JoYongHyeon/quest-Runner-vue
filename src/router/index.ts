import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import OAuthRedirectView from '../views/OAuthRedirectView.vue';
import OnboardingView from '../views/OnboardingView.vue';

// Vue Router의 Meta 필드 타입을 확장합니다. (Layout 지정용)
declare module 'vue-router' {
  interface RouteMeta {
    layout?: 'DefaultLayout' | 'AuthLayout';
  }
}

/**
 * Vue Router 설정
 * - URL 경로와 컴포넌트를 매핑
 * - meta.layout 속성을 통해 페이지별 레이아웃을 지정
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // [메인 페이지] - 기본 레이아웃
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { layout: 'DefaultLayout' }
    },
    // [OAuth2 리다이렉트 페이지] - 빈 레이아웃
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
      meta: { layout: 'DefaultLayout' }
    }
  ]
});

export default router;

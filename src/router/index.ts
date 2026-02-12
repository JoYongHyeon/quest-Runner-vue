import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router';
import PartyListView from '../views/party/PartyListView.vue';
import OAuthRedirectView from '../views/auth/OAuthRedirectView.vue';
import MyProfileView from '../views/auth/MyProfileView.vue';
import CreateContentView from '../views/content/CreateContentView.vue';
import PartyDetailView from '../views/party/PartyDetailView.vue';
import MyPartyView from '../views/party/MyPartyView.vue';
import { useAuth } from '../composables/useAuth';

declare module 'vue-router' {
  interface RouteMeta {
    /** 사용할 레이아웃 컴포넌트 이름 (기본값: DefaultLayout) */
    layout?: 'DefaultLayout' | 'AuthLayout';
    /** 우측 사이드바 숨김 여부 */
    hideRightSidebar?: boolean;
  }
}

/**
 * [Navigation Guard] 인증이 필요한 라우트 접근 제어
 * - 로그인 여부 및 온보딩(프로필 완성) 상태를 확인합니다.
 */
const requireAuth = async (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const auth = useAuth();

    // 1. 현재 로그인 상태가 아니면, 토큰 재확인(새로고침 직후 등)
    if (!auth.currentUser.value) {
        try {
            await auth.checkAuth();
            // 체크 후에도 없으면 로그인 필요
            if (!auth.currentUser.value) {
                alert('로그인이 필요한 서비스입니다.');
                return next('/'); // 또는 로그인 페이지
            }
        } catch (e) {
            return next('/');
        }
    }

    // 2. 온보딩(프로필 설정) 미완료 시 강제 이동
    if (auth.currentUser.value?.status === 'PENDING_PROFILE') {
        alert('모험가 등록(프로필 완성)을 먼저 진행해주세요! 퀘스트를 수행하려면 필수입니다.');
        return next('/profile');
    }

    // 통과
    next();
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 1. 메인 홈 (파티 목록)
    {
      path: '/',
      name: 'home',
      component: PartyListView,
      meta: { layout: 'DefaultLayout' }
    },

    // 2. OAuth2 리다이렉트 (로그인 성공 후 복귀)
    {
      path: '/oauth2/redirect',
      name: 'oauth-redirect',
      component: OAuthRedirectView,
      meta: { layout: 'AuthLayout' } 
    },

    // 3. 내 프로필 설정 (온보딩 포함)
    {
      path: '/profile',
      name: 'my-profile',
      component: MyProfileView,
      meta: { layout: 'DefaultLayout', hideRightSidebar: true }
    },

    // 4. 콘텐츠 생성 (파티 모집)
    {
      path: '/create',
      name: 'create-content',
      component: CreateContentView,
      meta: { layout: 'DefaultLayout', hideRightSidebar: true },
      beforeEnter: requireAuth // 인증 가드 적용
    },

    // 5. 파티 수정 (생성 페이지 재사용)
    // - URL 파라미터(:id) 유무로 생성/수정을 구분합니다.
    {
        path: '/party/:id/edit',
        name: 'edit-party',
        component: CreateContentView,
        meta: { layout: 'DefaultLayout', hideRightSidebar: true },
        beforeEnter: requireAuth // 인증 가드 적용
    },

    // 6. 파티 상세 조회 (퀘스트 룸)
    {
      path: '/party/:id',
      name: 'party-detail',
      component: PartyDetailView,
      meta: { layout: 'DefaultLayout' }
    },

    // 7. 내 파티 관리 (지원자 관리 등)
    {
      path: '/my-party',
      name: 'my-party',
      component: MyPartyView,
      meta: { layout: 'DefaultLayout' }
    }
  ]
});

export default router;

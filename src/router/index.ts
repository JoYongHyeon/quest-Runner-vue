import { createRouter, createWebHistory } from 'vue-router';
import PartyListView from '../views/party/PartyListView.vue';
import OAuthRedirectView from '../views/auth/OAuthRedirectView.vue';
import MyProfileView from '../views/auth/MyProfileView.vue'; // [New]
import CreateContentView from '../views/content/CreateContentView.vue';
import PartyDetailView from '../views/party/PartyDetailView.vue';
import MyPartyView from '../views/party/MyPartyView.vue';
import { useAuth } from '../composables/useAuth';

declare module 'vue-router' {
  interface RouteMeta {
    layout?: 'DefaultLayout' | 'AuthLayout';
    hideRightSidebar?: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PartyListView,
      meta: { layout: 'DefaultLayout' }
    },
    {
      path: '/oauth2/redirect',
      name: 'oauth-redirect',
      component: OAuthRedirectView,
      meta: { layout: 'AuthLayout' } 
    },
    // [수정됨] /onboarding -> /profile (MyProfileView 사용)
    {
      path: '/profile',
      name: 'my-profile',
      component: MyProfileView,
      meta: { layout: 'DefaultLayout', hideRightSidebar: true }
    },
    {
      path: '/create',
      name: 'create-content',
      component: CreateContentView,
      meta: { layout: 'DefaultLayout', hideRightSidebar: true },
      beforeEnter: async (to, _from, next) => {
          const auth = useAuth();
          if (!auth.currentUser.value) {
              try {
                  await auth.fetchMyProfile();
              } catch (e) {
                  return next('/'); 
              }
          }
          // 온보딩 미완료 시 /profile로 이동
          if (auth.currentUser.value?.status === 'PENDING_PROFILE') {
              alert('모험가 등록(프로필 완성)이 필요합니다.');
              next('/profile');
          } else {
              next();
          }
      }
    },
    {
      path: '/party/:id',
      name: 'party-detail',
      component: PartyDetailView,
      meta: { layout: 'DefaultLayout' }
    },
    {
      path: '/my-party',
      name: 'my-party',
      component: MyPartyView,
      meta: { layout: 'DefaultLayout' }
    }
  ]
});

export default router;
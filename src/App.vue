<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from './composables/useAuth';

const route = useRoute();
const { checkAuth } = useAuth();

// 앱 시작 시 로그인 상태 확인
onMounted(() => {
  checkAuth();
});

// Import Layouts Asynchronously for optimization
const DefaultLayout = defineAsyncComponent(() => import('./layouts/DefaultLayout.vue'));
const AuthLayout = defineAsyncComponent(() => import('./layouts/AuthLayout.vue'));

/**
 * Dynamic Layout Resolver
 * Matches route.meta.layout to actual component.
 * Default is DefaultLayout.
 */
const layout = computed(() => {
  const layoutName = route.meta.layout;
  if (layoutName === 'AuthLayout') return AuthLayout;
  return DefaultLayout;
});
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
/**
 * AuthLayout.vue
 * Simple centered layout for Login/Onboarding pages.
 */
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center mb-6">
             <div class="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">Q</div>
        </div>
        <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">
            <slot name="title">Quest Runner</slot>
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
             <slot name="subtitle">Start your adventure</slot>
        </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
        <!-- Main Content -->
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * AppRightSidebar.vue
 * - 메인 화면 우측에 위치하는 커뮤니티 정보 및 위젯 사이드바입니다.
 * - 모바일 환경에서는 숨겨지며(hidden), 데스크탑(xl) 이상에서만 노출됩니다.
 */
</script>

<template>
    <aside class="hidden xl:block w-80 space-y-4">
        
        <!-- 1. 커뮤니티 정보 카드 -->
        <div class="bg-white border border-gray-200 rounded p-3
                    dark:bg-[var(--color-reddit-dark)] dark:border-[var(--color-reddit-border)]">
            
            <!-- 카드 헤더 -->
            <div class="flex items-center gap-2 mb-2 text-sm font-bold text-gray-500 dark:text-[var(--color-reddit-text-muted)]">
                🏹 모험가 길드
            </div>
            
            <!-- 커뮤니티 타이틀 -->
            <div class="flex items-center gap-2 mb-3">
                 <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-2xl">🌍</div>
                 <span class="font-bold text-lg dark:text-[var(--color-reddit-text)]">Quest Runner</span>
            </div>

            <!-- 설명 텍스트 -->
            <p class="text-xs text-gray-600 mb-4 dark:text-[var(--color-reddit-text-muted)]">
                개발자들을 위한 RPG 감성 팀 빌딩 플랫폼입니다.
            </p>
            
            <!-- 통계 정보 (가입자, 접속자) -->
            <div class="flex gap-8 mb-4 border-b border-gray-200 pb-4 dark:border-[var(--color-reddit-border)]">
                 <div>
                    <div class="font-bold text-sm dark:text-[var(--color-reddit-text)]">1.2k</div>
                    <div class="text-xs text-gray-500 dark:text-[var(--color-reddit-text-muted)]">모험가</div>
                 </div>
                 <div>
                    <div class="font-bold text-sm dark:text-[var(--color-reddit-text)] flex items-center gap-1">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span> 142
                    </div>
                    <div class="text-xs text-gray-500 dark:text-[var(--color-reddit-text-muted)]">온라인</div>
                 </div>
            </div>

            <!-- 액션 버튼 -->
            <button class="w-full btn btn-primary rounded-full text-sm font-bold">
                퀘스트 생성
            </button>
        </div>

        <!-- 2. 규칙 카드 (Sticky 적용) -->
        <div class="bg-white border border-gray-200 rounded p-3 sticky top-16
                    dark:bg-[var(--color-reddit-dark)] dark:border-[var(--color-reddit-border)]">
            <div class="text-xs font-bold text-gray-500 uppercase mb-3 border-b pb-2 dark:border-[var(--color-reddit-border)] dark:text-[var(--color-reddit-text-muted)]">
                규칙
            </div>
            <ol class="list-decimal list-inside text-xs text-gray-700 space-y-2 dark:text-[var(--color-reddit-text)]">
                <li class="pl-1">존중하는 언어 사용</li>
                <li class="pl-1">스팸 금지</li>
                <li class="pl-1">즐겁게 모험하기</li>
            </ol>
        </div>
    </aside>
</template>
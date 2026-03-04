<script setup lang="ts">
/**
 * AboutView.vue
 * - Quest-Runner의 탄생 배경, 핵심 가치, 사용 가이드를 제공하는 정적 페이지입니다.
 * - 가독성을 극대화한 레딧/노션 스타일의 깔끔한 타이포그래피를 적용했습니다.
 */
</script>

<template>
  <div class="max-w-4xl mx-auto py-12 px-6 sm:px-8 font-sans antialiased text-gray-900 dark:text-[#D7DADC]">
    
    <!-- Hero Section -->
    <section class="text-center mb-20">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-xl mb-8 transform hover:scale-105 transition-transform">
        <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      </div>
      <h1 class="text-4xl md:text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
        신뢰를 데이터로 증명하는 곳,<br/>Quest-Runner
      </h1>
      <p class="text-lg text-gray-500 dark:text-[#818384] font-medium max-w-2xl mx-auto leading-relaxed">
        사이드 프로젝트를 구하는 일은 왜 항상 피곤하고 불안할까요?<br>
        우리는 이 문제를 해결하기 위해 팀 빌딩을 하나의 <strong>'위대한 여정(Quest)'</strong>으로 정의했습니다.
      </p>
    </section>

    <!-- 1. The Problem -->
    <section class="mb-20">
      <h2 class="text-2xl font-black border-b-2 border-gray-100 dark:border-[#343536] pb-4 mb-8 flex items-center gap-3">
        <span class="text-red-500">01</span> 왜 만들었을까요?
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-red-50 dark:bg-red-900/10 p-8 rounded-[2rem] border border-red-100 dark:border-red-900/30">
            <div class="text-3xl mb-4 grayscale opacity-80">👻</div>
            <h3 class="text-xl font-bold text-red-900 dark:text-red-400 mb-3 tracking-tight">무책임한 잠수와 파기</h3>
            <p class="text-sm text-red-800/80 dark:text-red-300/80 leading-relaxed">
                기존의 팀 빌딩 플랫폼에서는 누군가 무단으로 잠수를 타거나 프로젝트를 폭파시켜도 <strong>아무런 기록이 남지 않습니다.</strong> 피해는 고스란히 남은 팀원들의 몫이었죠.
            </p>
        </div>
        <div class="bg-gray-50 dark:bg-[#1A282D] p-8 rounded-[2rem] border border-gray-200 dark:border-[#343536]">
            <div class="text-3xl mb-4 grayscale opacity-80">📄</div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">이력서의 거짓말</h3>
            <p class="text-sm text-gray-600 dark:text-[#818384] leading-relaxed">
                화려한 포트폴리오를 보고 뽑았지만, 실제 협업 태도(인성, 책임감, 소통 능력)는 시작해 보기 전까지 알 수 없습니다. 우리는 <strong>진짜 실력은 '협업 이력'에 있다</strong>고 믿습니다.
            </p>
        </div>
      </div>
    </section>

    <!-- 2. The Solution -->
    <section class="mb-20">
      <h2 class="text-2xl font-black border-b-2 border-gray-100 dark:border-[#343536] pb-4 mb-8 flex items-center gap-3">
        <span class="text-blue-500">02</span> 어떻게 해결하나요?
      </h2>
      
      <div class="space-y-8">
        <!-- Feature 1 -->
        <div class="flex flex-col md:flex-row gap-6 items-start">
            <div class="w-14 h-14 shrink-0 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center font-black text-xl">
                1
            </div>
            <div>
                <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2">모든 여정의 박제 (Immutable Log)</h3>
                <p class="text-gray-600 dark:text-[#818384] leading-relaxed text-sm md:text-base">
                    Quest-Runner에서 생성된 퀘스트는 시작, 성공, 취소, 탈퇴, 추방 등 모든 상태 전이가 데이터베이스에 <strong>수정 불가능한 타임라인</strong>으로 영구 기록됩니다. 
                    <br><br>
                    <span class="inline-block bg-gray-100 dark:bg-[#202022] p-3 rounded-lg text-xs font-bold text-gray-700 dark:text-[#D7DADC] border border-gray-200 dark:border-[#343536]">
                        💡 리더가 모집을 취소해도, 팀원이 도망가도 그 이력은 평판 점수로 남아 꼬리표처럼 따라다닙니다.
                    </span>
                </p>
            </div>
        </div>

        <!-- Feature 2 -->
        <div class="flex flex-col md:flex-row gap-6 items-start">
            <div class="w-14 h-14 shrink-0 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center font-black text-xl">
                2
            </div>
            <div>
                <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2">추방 사유의 투명한 공개</h3>
                <p class="text-gray-600 dark:text-[#818384] leading-relaxed text-sm md:text-base">
                    리더가 인성 문제나 무단결근으로 팀원을 강제 추방할 경우, 반드시 사유를 입력해야 합니다. 이 사유는 해당 유저가 다음번 퀘스트에 지원할 때 <strong>새로운 리더에게 빨간색 경고창으로 여과 없이 노출</strong>됩니다.
                </p>
            </div>
        </div>

        <!-- Feature 3 -->
        <div class="flex flex-col md:flex-row gap-6 items-start">
            <div class="w-14 h-14 shrink-0 rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 flex items-center justify-center font-black text-xl">
                3
            </div>
            <div>
                <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2">원스톱 슬롯 기반 관리 (Slot-Centric UX)</h3>
                <p class="text-gray-600 dark:text-[#818384] leading-relaxed text-sm md:text-base">
                    어렵고 복잡한 관리자 페이지는 없습니다. RPG 게임에서 파티원을 모집하듯, 상세 페이지의 <strong>'슬롯(자리)'을 클릭하는 것만으로</strong> 지원자를 검토하고 팀원을 관리할 수 있습니다.
                </p>
            </div>
        </div>
      </div>
    </section>

    <!-- 3. How to use (Guide) -->
    <section class="mb-20">
      <h2 class="text-2xl font-black border-b-2 border-gray-100 dark:border-[#343536] pb-4 mb-8 flex items-center gap-3">
        <span class="text-gray-900 dark:text-white">03</span> 완벽 사용 가이드
      </h2>

      <div class="bg-gray-50 dark:bg-[#1A282D] rounded-3xl border border-gray-200 dark:border-[#343536] overflow-hidden">
        
        <!-- Tab: 파티장 -->
        <div class="p-8 border-b border-gray-200 dark:border-[#343536]">
            <h3 class="text-lg font-black mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                👑 파티장(리더)이라면 이렇게 하세요.
            </h3>
            <ol class="space-y-5 list-decimal list-inside text-sm md:text-base text-gray-700 dark:text-[#D7DADC] font-medium marker:text-blue-500 marker:font-black pl-4">
                <li class="pl-2">
                    <strong>퀘스트 생성:</strong> 필요한 포지션(백엔드, 디자이너 등)과 기술 스택을 슬롯으로 구성해 퀘스트를 올립니다. (1인 1진행 정책 적용)
                </li>
                <li class="pl-2">
                    <strong>지원자 검증:</strong> 빈 슬롯(<span class="text-blue-600 font-bold">RECRUITING</span>)을 클릭하면 지원자 명단이 뜹니다. 여기서 이들의 <strong>'성공 횟수'</strong>와 <strong>'추방 이력'</strong>을 반드시 확인하고 수락하세요.
                </li>
                <li class="pl-2">
                    <strong>여정 시작:</strong> 원하는 팀원이 1명이라도 모였다면 <strong>[퀘스트 시작]</strong>을 누르세요. 이때부터 공식적인 타임라인이 기록되며, 협업용 비밀 링크가 오픈됩니다.
                </li>
                <li class="pl-2">
                    <strong>팀원 관리:</strong> 진행 중 잠수타는 팀원이 있다면? 확정된 슬롯(<span class="text-green-600 font-bold">LOCKED</span>)을 눌러 단호하게 <strong>강제 추방</strong>하세요. 자리는 즉시 다시 비워져(OPEN) 새로운 동료를 받을 수 있습니다.
                </li>
            </ol>
        </div>

        <!-- Tab: 지원자 -->
        <div class="p-8">
            <h3 class="text-lg font-black mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                ⚔️ 지원자(멤버)라면 이렇게 하세요.
            </h3>
            <ol class="space-y-5 list-decimal list-inside text-sm md:text-base text-gray-700 dark:text-[#D7DADC] font-medium marker:text-emerald-500 marker:font-black pl-4">
                <li class="pl-2">
                    <strong>신중한 지원:</strong> 모집 중인 퀘스트의 슬롯을 눌러 지원 메시지를 남기세요. 단, 무분별한 지원은 금물입니다.
                </li>
                <li class="pl-2">
                    <strong>책임감 있는 활동:</strong> 일단 승인되어 합류했다면 끝까지 책임지세요. 힘들다고 중간에 <strong>탈퇴 버튼</strong>을 누르면 이력에 영구 박제됩니다.
                </li>
                <li class="pl-2">
                    <strong>성공적인 완주:</strong> 리더가 퀘스트를 '성공 종료'시키면 당신의 프로필에 명예로운 <strong>'성공(COMPLETED)' 뱃지</strong>가 하나 추가됩니다. 이 뱃지들이 차곡차곡 모여, 당신의 진짜 실력과 책임감을 증명하는 <strong>평생의 '신뢰 자산'</strong>이 될 것입니다.
                </li>
            </ol>
        </div>

      </div>
    </section>

    <!-- Footer CTA -->
    <section class="text-center mt-32 py-16 border-t border-gray-200 dark:border-[#343536]">
        <h2 class="text-2xl md:text-3xl font-black mb-6 dark:text-white">이제, 당신의 실력을 증명할 시간입니다.</h2>
        <button @click="$router.push('/')" class="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-2xl hover:shadow-black/50 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            새로운 여정 떠나기
        </button>
    </section>

  </div>
</template>

<style scoped>
/* 텍스트 가독성을 위한 부드러운 안티앨리어싱 */
.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

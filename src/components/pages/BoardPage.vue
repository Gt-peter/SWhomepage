<template>
  <div class="page">
    <TresCanvas class="scene-canvas" shadows>
      <Suspense>
        <!-- 카메라: 선언형으로 설정 (컨텍스트 에러 없음) -->
        <TresPerspectiveCamera
          make-default
          :position="[0.2, 1.5, 2.2]"
          :look-at="[0, 1.35, -2.8]"
        />

        <!-- 라이트/모델: 캔버스 내부(OK) -->
        <CommonLights />
        <group ref="root">
          <BoardModel :position="[0, 1.3, -2.2]" :scale="1.05" />
        </group>
      </Suspense>
    </TresCanvas>

    <div class="overlay-panel">
      <h2>게시판</h2>
      <p>여기에 실제 게시판 UI(목록/상세/탭 등) 올리기</p>
      <button class="small" @click="goCenter">뒤로</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import CommonLights from '@/components/system/CommonLights.vue'
import BoardModel from '@/components/models/BoardModel.vue'

const router = useRouter()
const goCenter = () => router.push({ name: 'center' }).catch(() => {})
</script>

<style scoped>
.page {
  position: relative; width: 100%; height: 100vh;
  isolation: isolate;                 /* 쌓임 맥락 고정 */
}
.scene-canvas {
  position: absolute; inset: 0; z-index: 0;
}
.scene-canvas canvas {
  position: absolute; inset: 0; z-index: 0 !important;
}
.overlay-panel {
  position: fixed; right: 24px; top: 24px; z-index: 9999; /* 오버레이를 최상단 */
  width: min(380px, 40vw);
  background: rgba(16,17,20,.7);
  color: #fff; padding: 16px; border-radius: 12px; backdrop-filter: blur(6px);
}
.small { margin-top: 12px; padding: 8px 12px; }
</style>

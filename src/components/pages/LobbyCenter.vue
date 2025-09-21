<template>
  <div class="page">
    <TresCanvas class="scene-canvas" shadows>
      <Suspense>
        <CenterScene @hover="onHover" />
      </Suspense>
    </TresCanvas>

    <!-- 디버깅용: 안 보이면 v-show 대신 style로 투명도만 내리면 존재 확인 가능 -->
    <button
      class="overlay-btn"
      :style="{
        left: hover.x + 'px',
        top:  hover.y + 'px',
        opacity: hover.show ? 1 : 0.001,
        pointerEvents: hover.show ? 'auto' : 'none'
      }"
      @click="goBoard"
    >
      게시판 보기
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CenterScene from '@/components/control/CenterScene.vue'

const router = useRouter()
const hover = ref<{show:boolean;x:number;y:number}>({ show:false, x:0, y:0 })
const onHover = (p: {show:boolean;x:number;y:number}) => { hover.value = p }
const goBoard = () => router.push({ name: 'board' }).catch(() => {})
</script>

<style scoped>
.page {
  position: relative; width: 100%; height: 100vh;
  isolation: isolate;              /* ← 쌓임 맥락 고정 */
}
.scene-canvas {
  position: absolute; inset: 0;
  z-index: 0;                      /* ← 캔버스를 맨 뒤로 */
}
.scene-canvas canvas {             /* 일부 브라우저에서 캔버스 자체가 위로 뜨는 것 방지 */
  position: absolute; inset: 0;
  z-index: 0 !important;
}
.overlay-btn {
  position: fixed;                 /* 스크롤에도 정확한 위치 */
  transform: translate(-50%, -100%);
  z-index: 9999;                   /* ← 오버레이를 최상단으로 */
  pointer-events: auto;
  padding: .55rem .8rem; border-radius: 10px; border: 1px solid rgba(30,144,255,.6);
  background: #101114; color: #fff;
  box-shadow: 0 6px 16px rgba(0,0,0,.25), 0 0 18px rgba(30,144,255,.35);
}
</style>

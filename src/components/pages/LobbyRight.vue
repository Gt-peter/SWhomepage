<template>
  <div class="page">
    <TresCanvas>
      <Suspense>
        <CommonLights />
        <primitive :object="rightScene" v-if="rightScene" />
        <CorridorPlaceholder v-else variant="right" />
      </Suspense>
    </TresCanvas>

    <div class="hint">← left / center →</div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGLTF } from '@tresjs/cientos'
import { useTres } from '@tresjs/core'
import * as THREE from 'three'
import CommonLights from '@/components/system/CommonLights.vue'
import CorridorPlaceholder from '@/components/system/CorridorPlaceholder.vue'

const router = useRouter()
const { camera } = useTres()

const rightScene = ref<THREE.Object3D | null>(null)
try {
  const { scene } = await useGLTF('/models/lobby_right.glb', { draco: true }) as { scene: THREE.Object3D }
  rightScene.value = scene
} catch (e) {
  console.warn('[LobbyRight] GLB not found, using placeholder:', e)
  rightScene.value = null
}

onMounted(() => {
  const cam = camera.value as THREE.PerspectiveCamera
  cam.position.set(1.2, 1.6, 3.2)
  cam.lookAt(5, 1.4, -6)
})

const keyHandler = (e: KeyboardEvent) => {
  if (e.code === 'ArrowLeft')  { e.preventDefault(); router.push({ name: 'left'   }) }
  if (e.code === 'ArrowRight') { e.preventDefault(); router.push({ name: 'center' }) }
}
onMounted(() => window.addEventListener('keydown', keyHandler))
onBeforeUnmount(() => window.removeEventListener('keydown', keyHandler))
</script>

<style scoped>
.page { position: relative; width: 100%; height: 100vh; }
.hint {
  position: absolute; left: 50%; bottom: 24px; transform: translateX(-50%);
  color: #fff; background: rgba(0,0,0,.35); padding: 6px 10px; border-radius: 8px;
}
</style>

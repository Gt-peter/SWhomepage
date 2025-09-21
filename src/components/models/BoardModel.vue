<script lang="ts" setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { useGLTF } from '@tresjs/cientos'

interface Props {
  position?: [number, number, number]
  rotationY?: number
  scale?: number
}
const props = withDefaults(defineProps<Props>(), {
  position: () => [0, 1.2, -3],
  rotationY: 0,
  scale: 1,
})

const { scene: board } = await useGLTF('/models/board.glb', { draco: true }) as {
  scene: THREE.Object3D
}

onMounted(() => {
  const [x, y, z] = props.position
  board.position.set(x, y, z)
  board.rotation.y = props.rotationY
  board.scale.setScalar(props.scale)
})

defineExpose<{ board: THREE.Object3D }>({ board })
</script>

<template>
  <primitive :object="board" />
</template>

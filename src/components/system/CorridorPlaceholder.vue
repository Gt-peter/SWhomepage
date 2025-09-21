<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted } from 'vue'
import { useTres } from '@tresjs/core'

type Variant = 'center' | 'left' | 'right'
const props = defineProps<{ variant?: Variant }>()
const variant = props.variant ?? 'center'

const { scene } = useTres()

// 아주 가벼운 복도 형태: 바닥 + 좌우/정면 벽
const root = new THREE.Group()

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x3a3f45, roughness: 0.95, metalness: 0.0 })
)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
root.add(floor)

function wall(w: number, h: number, color: number) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ color, roughness: 1.0 })
  )
  m.receiveShadow = true
  return m
}

const leftWall  = wall(20, 5, 0x2b2e33)
leftWall.position.set(-10, 2.5, -5)
leftWall.rotation.y =  Math.PI / 2
root.add(leftWall)

const rightWall = wall(20, 5, 0x2b2e33)
rightWall.position.set(10, 2.5, -5)
rightWall.rotation.y = -Math.PI / 2
root.add(rightWall)

const backWall  = wall(20, 5, 0x24262a)
backWall.position.set(0, 2.5, -15)
root.add(backWall)

// 페이지별 분위기 약간씩 차이
if (variant === 'left')  (leftWall.material as THREE.MeshStandardMaterial).color.set(0x30343a)
if (variant === 'right') (rightWall.material as THREE.MeshStandardMaterial).color.set(0x30343a)

onMounted(() => {
  scene.value.add(root)
})

defineExpose<{ group: THREE.Group }>({ group: root })
</script>

<template>
  <!-- three primitive가 아니라, 위에서 scene에 attach 했으므로 템플릿은 비워둬도 됨 -->
</template>

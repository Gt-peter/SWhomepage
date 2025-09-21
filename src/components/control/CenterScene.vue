<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useTres } from '@tresjs/core'
import { useGLTF } from '@tresjs/cientos'

const emit = defineEmits<{ (e:'hover', p:{show:boolean;x:number;y:number}): void }>()
const { camera, renderer, scene } = useTres()

const raycaster = new THREE.Raycaster()
const pointer   = new THREE.Vector2()
let boardObj: THREE.Object3D | null = null

// 아웃라인 라인 세그먼트 모음 (hover on/off 제어용)
const outlineLines: THREE.LineSegments[] = []

const urlJoin = (base: string, path: string) =>
  `${(base ?? '/').replace(/\/+$/, '/')}${path.replace(/^\/+/, '')}`
const glb = (p: string) => urlJoin(import.meta.env.BASE_URL ?? '/', p)

// 버튼용: 뷰포트 절대좌표 반환 (스크롤에도 정확)
const toScreenPos = (obj: THREE.Object3D) => {
  const cam = camera.value as THREE.PerspectiveCamera
  const p = new THREE.Vector3().setFromMatrixPosition(obj.matrixWorld).project(cam)
  const rect = (renderer.value!.domElement as HTMLCanvasElement).getBoundingClientRect()
  return {
    x: rect.left + (p.x * 0.5 + 0.5) * rect.width,
    y: rect.top  + (-p.y * 0.5 + 0.5) * rect.height - 16,
  }
}

// 대상 메시에 EdgesGeometry로 테두리 라인 부착
function attachOutline(target: THREE.Object3D) {
  outlineLines.length = 0
  target.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (!mesh.isMesh || !mesh.geometry) return
    const egeo = new THREE.EdgesGeometry(mesh.geometry, 40) // 임계각 40도
    const line = new THREE.LineSegments(
      egeo,
      new THREE.LineBasicMaterial({ color: 0x1e90ff, transparent: true, opacity: 0 })
    )
    // 메쉬 로컬 좌표계에 붙이기
    line.position.copy(mesh.position)
    line.rotation.copy(mesh.rotation)
    line.scale.copy(mesh.scale)
    mesh.add(line)
    outlineLines.push(line)
  })
}

function setHighlight(on: boolean) {
  for (const seg of outlineLines) {
    const mat = seg.material as THREE.LineBasicMaterial
    mat.opacity = on ? 1 : 0
    mat.needsUpdate = true
  }
  // GLTF 기본 머티리얼에 약간의 발광도 주면 더 또렷
  boardObj?.traverse((c) => {
    const m = (c as THREE.Mesh).material as any
    if (m && m.emissive) {
      m.emissive.setHex(on ? 0x1e90ff : 0x000000)
      m.emissiveIntensity = on ? 0.5 : 0
    }
  })
}

function onPointerMove(e: PointerEvent) {
  if (!boardObj || !renderer.value) { emit('hover', { show:false, x:0, y:0 }); return }
  const el = renderer.value.domElement as HTMLCanvasElement
  const rect = el.getBoundingClientRect()
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  const cam = camera.value as THREE.PerspectiveCamera
  raycaster.setFromCamera(pointer, cam)
  const hit = raycaster.intersectObject(boardObj, true)[0]
  if (hit) {
    setHighlight(true)
    const { x, y } = toScreenPos(boardObj)
    emit('hover', { show:true, x, y })
  } else {
    setHighlight(false)
    emit('hover', { show:false, x:0, y:0 })
  }
}

/* --------- 공간(룸) 코드로 구성 --------- */
function buildRoom(target: THREE.Scene) {
  target.fog = new THREE.Fog(0x1f2125, 12, 28)
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 24),
    new THREE.MeshStandardMaterial({ color: 0x353a40, roughness: 1, metalness: 0 })
  )
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  target.add(floor)

  const grid = new THREE.GridHelper(24, 24, 0x444444, 0x2a2d31)
  ;(grid.material as THREE.Material).transparent = true
  ;(grid.material as THREE.Material).opacity = 0.5
  target.add(grid)

  const wallMat = new THREE.MeshStandardMaterial({ color: 0x24262a, roughness: 1, metalness: 0 })
  const mkWall = () => new THREE.Mesh(new THREE.PlaneGeometry(24, 6), wallMat)
  const back = mkWall(); back.position.set(0, 3, -12)
  const left = mkWall(); left.rotation.y =  Math.PI / 2; left.position.set(-12, 3, 0)
  const right= mkWall(); right.rotation.y = -Math.PI / 2; right.position.set( 12, 3, 0)
  target.add(back, left, right)

  const hemi = new THREE.HemisphereLight(0xffffff, 0x222329, 0.6)
  const dir  = new THREE.DirectionalLight(0xffffff, 1.0)
  dir.position.set(6, 10, 6); dir.castShadow = true
  target.add(hemi, dir)
}

/* --------- 생명주기 --------- */
onMounted(() => {
  const s = scene.value as any
  if (!s || typeof s.add !== 'function') {
    console.error('[CenterScene] must be rendered inside <TresCanvas>.')
    return
  }

  const cam = camera.value as THREE.PerspectiveCamera
  cam.position.set(0, 1.8, 4.2)
  cam.lookAt(0, 1.4, -2.5)

  watch(
    () => renderer.value,
    (r, _, onCleanup) => {
      if (!r) return
      const el = r.domElement as HTMLCanvasElement
      el.addEventListener('pointermove', onPointerMove)
      onCleanup(() => el.removeEventListener('pointermove', onPointerMove))
    },
    { immediate: true }
  )

  buildRoom(s as THREE.Scene)

  // 게시판: GLB 있으면 사용, 없으면 대체
  useGLTF(glb('models/board.glb'))
    .then(({ scene: board }: any) => {
      board.position.set(0, 1.2, -3)
      ;(s as THREE.Scene).add(board)
      boardObj = board
      attachOutline(boardObj)
    })
    .catch(() => {
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(1.7, 1.0, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x0f1013 })
      )
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.6, 0.9),
        new THREE.MeshStandardMaterial({ color: 0x1e90ff, roughness: 0.6, metalness: 0.1 })
      )
      frame.position.set(0, 1.2, -3)
      plane.position.copy(frame.position)
      ;(s as THREE.Scene).add(frame, plane)
      boardObj = plane
      attachOutline(boardObj)
      console.warn('board.glb not found, using placeholder.')
    })
})

onBeforeUnmount(() => {
  // watch의 onCleanup으로 이벤트가 제거됨
})
</script>

<template></template>

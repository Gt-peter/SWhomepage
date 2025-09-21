<script setup>
import * as THREE from 'three'
import { useTres } from '@tresjs/core'

const { scene } = useTres()

const dir = new THREE.DirectionalLight(0xffffff, 1.1)
dir.position.set(6, 8, 4)
scene.value.add(dir, new THREE.AmbientLight(0xffffff, 0.25))
</script>

<template></template>

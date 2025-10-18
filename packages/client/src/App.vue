<template>
  <v-app>
    <v-main>
      <h1 @click="toTop">Jamtable</h1>
      <RouterView />
      <LogPopup />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useSocketStore } from '@/stores/socket'
import LogPopup from '@/components/popup/LogPopup.vue'

const router = useRouter()
const { on, push } = useSocketStore()

const toTop = () => {
  router.push('/')
}

on('connect', () => {
  push('user', 'connected')
})

on('disconnect', () => {
  push('user', 'disconnect')
})

on('error', (mes: string) => {
  push('user', 'error: ' + mes)
})
</script>

<style scoped>
h1 {
  display: inline-block;
  cursor: pointer;
}
</style>

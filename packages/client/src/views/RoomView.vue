<template>
  <div>
    <div>部屋番号: {{ joinRoom?.id }}</div>
    <div>なまえ: {{ name }}</div>
    <div>ユーザー: {{ roommate }}</div>

    <ChatPopup />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { onBeforeRouteLeave } from 'vue-router'
import { useSocketStore } from '@/stores/socket'
import { useUserStore } from '@/stores/user'
import ChatPopup from '@/components/popup/ChatPopup.vue'

import type { User } from '@/models'

const { emit } = useSocketStore()

const userStore = useUserStore()
const { name, joinRoom } = storeToRefs(userStore)

const roommate = computed(() => joinRoom.value?.users.map((user: User) => user.name).join(','))

onBeforeRouteLeave(() => {
  if (joinRoom.value) {
    emit('leave-room', joinRoom.value?.id)
  }
})
</script>

<style scoped>
/* All chat-related styles have been moved to ChatPopup.vue */
</style>
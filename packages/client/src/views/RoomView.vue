<template>
  <v-container>
    <div v-if="!joinRoom">
      <div>Loading...</div>
      <v-btn color="error" variant="tonal" to="/lobby">ロビーへ戻る</v-btn>
    </div>
    <v-row v-else justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>部屋: {{ joinRoom?.name }}</span>
            <v-btn color="error" variant="tonal" @click="leaveRoom">部屋を出る</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-list>
            <v-list-item :title="`あなたの名前: ${name}`"></v-list-item>
            <v-list-item :title="`参加者: ${roommate}`"></v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <ChatPopup />
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useSocketStore } from '@/stores/socket'
import { useUserStore } from '@/stores/user'
import ChatPopup from '@/components/popup/ChatPopup.vue'

import type { User } from '@/models'

const router = useRouter()
const { emit } = useSocketStore()

const userStore = useUserStore()
const { name, joinRoom } = storeToRefs(userStore)

const roommate = computed(() => joinRoom.value?.users.map((user: User) => user.name).join(', '))

const leaveRoom = () => {
  if (joinRoom.value) {
    emit('leave-room', joinRoom.value.id)
    router.push('/lobby')
  }
}

onBeforeRouteLeave(() => {
  if (joinRoom.value) {
    emit('leave-room', joinRoom.value.id)
  }
})
</script>

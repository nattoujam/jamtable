<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h2 class="text-h5">ようこそ、 {{ name }} さん</h2>
          <v-btn to="/" color="grey">ホームへ戻る</v-btn>
        </div>
      </v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>

    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title class="text-h6">新しい部屋を作る</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="createRoom">
              <v-text-field
                v-model="roomName"
                label="部屋名"
                variant="outlined"
                clearable
              ></v-text-field>
              <v-btn color="primary" block @click="createRoom" :disabled="!roomName.trim()"
                >部屋を作る</v-btn
              >
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-8"></v-divider>

    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h2 class="text-h5">参加可能な部屋</h2>
          <v-btn @click="refreshRooms" icon="mdi-refresh"></v-btn>
        </div>
        <v-row>
          <v-col v-for="room in rooms" :key="'room-' + room.id" cols="12" sm="6" md="4">
            <v-card>
              <v-card-title>{{ room.name }}</v-card-title>
              <v-card-subtitle
                >参加者: {{ room.users.map((u) => u.name).join(', ') }}</v-card-subtitle
              >
              <v-card-actions class="pa-3">
                <v-btn
                  color="primary"
                  variant="tonal"
                  size="large"
                  block
                  @click="() => enterRoom(room.id)"
                  >入室</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <div v-if="rooms.length === 0" class="text-center text-grey mt-4">
          参加可能な部屋はありません。
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSocketStore } from '@/stores/socket'
import { useUserStore } from '@/stores/user'
import { getRoom } from '@/utils/api'

import type { Room } from '@/models'

const router = useRouter()
const { emit } = useSocketStore()
const { name } = useUserStore()

const roomName = ref<string>('')
const rooms = ref<Array<Room>>([])

const createRoom = () => {
  if (!roomName.value.trim()) return
  emit('create-room', name, roomName.value)
  router.push('/room')
}

const refreshRooms = async () => {
  try {
    const res = await getRoom()
    rooms.value = res.data
  } catch (error) {
    console.error('Failed to refresh rooms:', error)
  }
}

const enterRoom = (roomId: number) => {
  emit('enter-room', name, roomId)
  router.push('/room')
}

onMounted(() => {
  refreshRooms()
})
</script>

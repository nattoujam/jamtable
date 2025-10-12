<template>
  <div>
    <div>ようこそ、 {{ name }} さん</div>
    <button @click="handleLogout">ログアウト</button>
    <hr />

    <div>
      部屋名*: <input v-model="roomName" type="text" />
      <button @click="createRoom">部屋を作る</button>
    </div>

    <hr />
    <h2>参加可能な部屋</h2>
    <button @click="refreshRooms">更新</button>
    <div v-for="room in rooms" :key="'room-' + room.id">
      <br />
      <div>部屋名: {{ room.name }}</div>
      <div>参加者: {{ room.users.map((u: User) => u.name).join(', ') }}</div>
      <button @click="() => enterRoom(room.id)">入室</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSocketStore } from '@/stores/socket'
import { useUserStore } from '@/stores/user'
import api from '@/utils/api'

import type { User, Room } from '@/models'

const router = useRouter()
const { emit } = useSocketStore()
const { name, logout } = useUserStore()

const roomName = ref<string>('')
const rooms = ref<Array<Room>>([])

const createRoom = () => {
  if (!roomName.value.trim()) return
  emit('create-room', name, roomName.value)
  router.push('/room')
}

const refreshRooms = async () => {
  try {
    const res = await api.get('/rooms')
    rooms.value = res.data
  } catch (error) {
    console.error('Failed to refresh rooms:', error)
  }
}

const enterRoom = (roomId: number) => {
  emit('enter-room', name, roomId)
  router.push('/room')
}

const handleLogout = () => {
  logout()
  router.push('/')
}

onMounted(() => {
  refreshRooms()
})
</script>

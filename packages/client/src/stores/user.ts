import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket.ts'
import { postLogin, postLogout } from '@/utils/api.ts'

import type { Room } from '@/models/index.ts'

export const useUserStore = defineStore('user', () => {
  const { on, push } = useSocketStore()

  const name = ref<string>(localStorage.getItem('userName') || '')
  const joinRoom = ref<Room | null>(null)

  const isLogin = computed(() => !!name.value)

  const login = async (newName: string) => {
    if (!newName.trim()) return
    const res = await postLogin(newName.trim())

    if (res.status === 200) {
      name.value = res.data.name
      localStorage.setItem('userName', name.value)
    }
  }

  const logout = async () => {
    await postLogout(name.value)

    name.value = ''
    joinRoom.value = null
    localStorage.removeItem('userName')
  }

  on('update-room', (newRoom: Room | null) => {
    push('user', `room: ${newRoom?.id}`)
    joinRoom.value = newRoom
  })

  return { name, joinRoom, isLogin, login, logout }
})

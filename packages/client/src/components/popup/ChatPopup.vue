<template>
  <v-fab
    location="bottom right"
    app
    color="primary"
    icon="mdi-chat"
    @click="isChatOpen = !isChatOpen"
  ></v-fab>

  <div v-if="isChatOpen" class="popup">
    <v-card max-width="400" elevation="8">
      <v-toolbar dense color="primary" dark>
        <v-toolbar-title>チャット</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="isChatOpen = false"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>

      <v-card-text class="chat-body" ref="chatBody">
        <v-list dense>
          <v-list-item
            v-for="(chat, index) in chatHistoryList"
            :key="index"
            :title="`${chat.userName}: ${chat.message}`"
            :subtitle="new Date(chat.timestamp).toLocaleTimeString()"
          ></v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions class="pa-2">
        <v-text-field
          v-model="chatInput"
          @keydown.enter="sendChat"
          placeholder="メッセージを入力..."
          dense
          outlined
          hide-details
          class="mr-2"
        ></v-text-field>
        <v-btn @click="sendChat" color="primary" icon="mdi-send"></v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSocketStore } from '@/stores/socket'
import { useUserStore } from '@/stores/user'
import type { Chat } from '@/models'

const { emit, on, off } = useSocketStore()
const userStore = useUserStore()
const { name, joinRoom } = storeToRefs(userStore)

const MAX_HISTORY = 100
const chatInput = ref('')
const chatHistoryList = ref<Chat[]>([])
const isChatOpen = ref(false)
const chatBody = ref<HTMLElement | null>(null)

const pushChat = (chat: Chat) => {
  chatHistoryList.value.push(chat)
  if (chatHistoryList.value.length > MAX_HISTORY) {
    chatHistoryList.value.shift()
  }
}

const sendChat = () => {
  if (!chatInput.value.trim() || !joinRoom.value) return

  const chat: Chat = {
    userName: name.value,
    message: chatInput.value,
    timestamp: Date.now(),
  }

  emit('send-chat', joinRoom.value.id, chat.message, chat.timestamp)
  pushChat(chat)
  chatInput.value = ''
}

on('receive-chat', (chat: Chat) => {
  if (chat.userName === name.value) return
  pushChat(chat)
})

watch(
  chatHistoryList,
  () => {
    nextTick(() => {
      const body = chatBody.value
      if (body) {
        body.scrollTop = body.scrollHeight
      }
    })
  },
  { deep: true },
)

onUnmounted(() => {
  off('receive-chat')
})
</script>

<style scoped>
.chat-body {
  height: 200px;
  overflow-y: auto;
}

.popup {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 400px;
  max-height: 600px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 1000;
}
</style>

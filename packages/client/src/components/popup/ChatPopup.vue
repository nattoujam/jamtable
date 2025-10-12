<template>
  <div>
    <!-- Chat FAB -->
    <div class="chat-fab" @click="toggleChat">
      <span class="material-icons">chat</span>
    </div>

    <!-- Chat Popup -->
    <div v-if="isChatOpen" class="chat-popup">
      <div class="chat-header">
        <h3>チャット</h3>
        <button class="close-btn" @click="toggleChat">&times;</button>
      </div>
      <div class="chat-body" ref="chatBody">
        <ul>
          <li v-for="(chat, index) in chatHistoryList" :key="index">
            <span>{{ chat.userName }}: {{ chat.message }}</span>
            <span>[{{ new Date(chat.timestamp).toLocaleTimeString() }}]</span>
          </li>
        </ul>
      </div>
      <div class="chat-footer">
        <input
          v-model="chatInput"
          type="text"
          @keydown.enter="sendChat"
          placeholder="メッセージを入力..."
        />
        <button @click="sendChat">送信</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useSocketStore } from "@/stores/socket";
import { useUserStore } from "@/stores/user";
import type { Chat } from "@/models";

const { emit, on, off } = useSocketStore();
const userStore = useUserStore();
const { name, joinRoom } = storeToRefs(userStore);

const MAX_HISTORY = 100;
const chatInput = ref("");
const chatHistoryList = ref<Chat[]>([]);
const isChatOpen = ref(false);
const chatBody = ref<HTMLElement | null>(null);

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};

const pushChat = (chat: Chat) => {
  chatHistoryList.value.push(chat);
  if (chatHistoryList.value.length > MAX_HISTORY) {
    chatHistoryList.value.shift();
  }
};

const sendChat = () => {
  if (!chatInput.value.trim() || !joinRoom.value) return;

  const chat: Chat = {
    userName: name.value,
    message: chatInput.value,
    timestamp: Date.now(),
  };

  emit("send-chat", joinRoom.value.id, chat.message, chat.timestamp);
  pushChat(chat);
  chatInput.value = "";
};

on("receive-chat", (chat: Chat) => {
  if (chat.userName === name.value) return;
  pushChat(chat);
});

watch(
  chatHistoryList,
  () => {
    if (isChatOpen.value) {
      nextTick(() => {
        const body = chatBody.value;
        if (body) {
          body.scrollTop = body.scrollHeight;
        }
      });
    }
  },
  { deep: true }
);

onUnmounted(() => {
  off("receive-chat");
});
</script>

<style scoped>
.chat-fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
  z-index: 999;
}

.chat-fab:hover {
  background-color: #0056b3;
}

.chat-fab span {
  font-size: 18px;
}

.chat-popup {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 350px;
  max-height: 500px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
}

.chat-header {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 1.1em;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.chat-body {
  flex-grow: 1;
  padding: 10px 15px;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.chat-body ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chat-body li {
  margin-bottom: 10px;
  font-size: 0.9em;
}

.chat-body li span:first-child {
  font-weight: bold;
}

.chat-body li span:last-child {
  color: #888;
  margin-left: 8px;
  font-size: 0.8em;
}

.chat-footer {
  padding: 10px;
  display: flex;
  border-top: 1px solid #eee;
}

.chat-footer input {
  flex-grow: 1;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  margin-right: 10px;
}

.chat-footer button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chat-footer button:hover {
  background-color: #0056b3;
}
</style>
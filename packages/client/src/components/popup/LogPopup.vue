<template>
  <div>
    <!-- Log FAB -->
    <div class="log-fab" @click="toggleLog">
      <span class="material-icons">description</span>
    </div>

    <!-- Log Popup -->
    <div v-if="isLogOpen" class="log-popup">
      <div class="log-header">
        <h3>ログ</h3>
        <button class="close-btn" @click="toggleLog">&times;</button>
      </div>
      <div class="log-body">
        <div class="log-content">{{ displayLog }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSocketStore } from '@/stores/socket'
import type { Log } from '@/stores/socket'

const { logList } = useSocketStore()
const displayLog = computed(() => {
  return logList.map((l: Log) => `[${l.logType}]: ${l.text}`).join('\n')
})

const isLogOpen = ref(false)
const toggleLog = () => {
  isLogOpen.value = !isLogOpen.value
}
</script>

<style scoped>
.log-fab {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: #6c757d;
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

.log-fab:hover {
  background-color: #5a6268;
}

.log-fab span {
  font-size: 18px;
}

.log-popup {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 400px;
  max-height: 600px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
}

.log-header {
  padding: 10px 15px;
  background-color: #6c757d;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
}

.log-header h3 {
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

.log-body {
  flex-grow: 1;
  overflow-y: auto;
  background-color: #f9f9f9;
  padding: 10px;
}

.log-content {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
  font-size: 0.9em;
  color: #333;
  background-color: transparent;
  border: none;
  resize: none;
}
</style>

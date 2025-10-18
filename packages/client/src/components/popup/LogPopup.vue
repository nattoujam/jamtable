<template>
  <v-fab
    location="top right"
    app
    icon="mdi-console"
    color="surface-variant"
    @click="isLogOpen = !isLogOpen"
  ></v-fab>

  <div v-if="isLogOpen" class="popup">
    <div class="log-header">
      <h3>ログ</h3>
      <v-btn icon variant="text" @click="toggleLog"><v-icon>mdi-close</v-icon></v-btn>
    </div>
    <div class="log-body">
      <div class="log-content">{{ displayLog }}</div>
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
.popup {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 400px;
  max-height: 600px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
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

/* .close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
} */

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

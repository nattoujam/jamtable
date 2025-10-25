<template>
  <div class="analog-clock-container">
    <svg viewBox="0 0 200 200" width="200" height="200">
      <!-- Clock Face -->
      <circle cx="100" cy="100" r="95" class="clock-face" />
      <circle cx="100" cy="100" r="4" class="center-dot" />

      <!-- Hour Markers -->
      <g v-for="h in 12" :key="`h-${h}`" :transform="`rotate(${h * 30}, 100, 100)`">
        <line x1="100" y1="15" x2="100" y2="25" class="hour-marker" />
      </g>
      
      <!-- Minute Markers -->
      <g v-for="m in 60" :key="`m-${m}`" :transform="`rotate(${m * 6}, 100, 100)`">
        <line v-if="m % 5 !== 0" x1="100" y1="15" x2="100" y2="20" class="minute-marker" />
      </g>

      <!-- Hands -->
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="50"
        class="hand hour-hand"
        :transform="`rotate(${hourRotation}, 100, 100)`"
      />
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="30"
        class="hand minute-hand"
        :transform="`rotate(${minuteRotation}, 100, 100)`"
      />
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="20"
        class="hand second-hand"
        :transform="`rotate(${secondRotation}, 100, 100)`"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const hourRotation = ref(0);
const minuteRotation = ref(0);
const secondRotation = ref(0);

let timerId: number | undefined;

const updateClock = () => {
  // Asia/Tokyoタイムゾーンの現在時刻を取得
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // 12時間制に変換
  const hours12 = hours % 12;

  // 各針の角度を計算
  // 秒針: 1秒あたり6度
  secondRotation.value = seconds * 6;
  // 分針: 1分あたり6度 + 秒の進み具合
  minuteRotation.value = minutes * 6 + seconds * 0.1;
  // 時針: 1時間あたり30度 + 分の進み具合
  hourRotation.value = hours12 * 30 + minutes * 0.5;
};

onMounted(() => {
  updateClock(); // 初期表示
  timerId = window.setInterval(updateClock, 1000);
});

onUnmounted(() => {
  if (timerId) {
    clearInterval(timerId);
  }
});
</script>

<style scoped>
.analog-clock-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
}

.clock-face {
  stroke: #424242;
  stroke-width: 4;
  fill: #f5f5f5;
}

.center-dot {
  fill: #424242;
}

.hour-marker {
  stroke: #424242;
  stroke-width: 3;
}

.minute-marker {
  stroke: #bdbdbd;
  stroke-width: 1;
}

.hand {
  stroke-linecap: round;
}

.hour-hand {
  stroke: #424242;
  stroke-width: 6;
}

.minute-hand {
  stroke: #424242;
  stroke-width: 4;
}

.second-hand {
  stroke: #f44336;
  stroke-width: 2;
}
</style>

<template>
  <div class="login-container">
    <h1>ようこそ！</h1>
    <p>名前を入力して参加してください</p>
    <div class="login-form">
      <input
        v-model="username"
        type="text"
        placeholder="あなたの名前"
        @keydown.enter="handleLogin"
      />
      <button @click="handleLogin">ロビーに入る</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const username = ref('')
const router = useRouter()
const userStore = useUserStore()

const handleLogin = () => {
  if (username.value.trim()) {
    userStore.login(username.value)
    router.push('/lobby')
  }
}

onMounted(() => {
  if (userStore.isLoggedIn) {
    router.push('/lobby')
  }
})
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 40px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h1 {
  font-size: 2em;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 30px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

button {
  padding: 12px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>
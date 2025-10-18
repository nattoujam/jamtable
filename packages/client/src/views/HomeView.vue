<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-center">
        <div v-if="!userStore.isLogin">
          <h2 class="text-h4 mb-4">ようこそ！</h2>
          <p class="text-subtitle-1 mb-8">名前を入力して参加してください</p>
          <v-form @submit.prevent="login">
            <v-text-field
              v-model="username"
              label="あなたの名前"
              name="username"
              prepend-icon="mdi-account"
              type="text"
              @keydown.enter="login"
              variant="solo"
              class="mx-auto" style="max-width: 400px;"
            ></v-text-field>
            <v-btn class="mt-4" color="primary" size="large" @click="login">ログイン</v-btn>
          </v-form>
        </div>
        <div v-else>
          <h2 class="text-h4 mb-4">こんにちは、{{ userStore.name }}さん</h2>
          <div class="d-flex justify-center ga-4">
            <v-btn color="primary" to="/lobby" size="large">ロビーに入る</v-btn>
            <v-btn color="secondary" @click="userStore.logout()" size="large">ログアウト</v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/user";

const username = ref("");
const userStore = useUserStore();

const login = async () => {
  if (username.value.trim()) {
    await userStore.login(username.value);
    username.value = ""; // 入力欄をクリア
  }
};
</script>
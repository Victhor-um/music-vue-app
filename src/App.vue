<template>
  <div class="relative mb-[64px]">
    <app-header />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component"> </component>
      </transition>
    </router-view>
    <div class="fixed bottom-0 z-10">
      <player-music />
    </div>
    <app-auth />
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppAuth from './components/AppAuth.vue'
import useUserStore from '@/stores/user'
import { auth } from '@/includes/firebase'
import { onMounted } from 'vue'
import PlayerMusic from './components/PlayerMusic.vue'

function created() {
  if (auth.currentUser) {
    const userStore = useUserStore()
    userStore.setUserLoggedIn(true)
  }
}
onMounted(created)
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.35s linear;
}
.fade-leave-to {
  transition: all 0.35s linear;
  opacity: 0;
}
</style>

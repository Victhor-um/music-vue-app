<template>
  <app-header />

  <router-view />
  <player-music />
  <app-auth />
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

<style lang="scss" scoped></style>

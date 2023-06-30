<template>
  <!-- Player -->
  <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
    <!-- Track Info -->
    <div class="text-center" v-if="playerStore.currentSong.modifiedName">
      <span class="song-title font-bold">{{ playerStore.currentSong.modifiedName }}</span> by
      <span class="song-artist">{{
        playerStore.currentSong.displayName ? playerStore.currentSong.displayName : 'Artist'
      }}</span>
    </div>
    <div class="flex flex-nowrap gap-4 items-center">
      <!-- Play/Pause Button -->
      <button type="button" @click.prevent="playerStore.toggleAudio">
        <i
          class="fa text-gray-500 text-xl"
          :class="{ 'fa-play': !playing, 'fa-pause': playing }"
        ></i>
      </button>
      <!-- Current Position -->
      <div class="player-currenttime">{{ seek }}</div>
      <!-- Scrub Container  -->
      <div
        class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
        @click.prevent="updateSeek"
      >
        <!-- Player Ball -->
        <span
          class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg"
          :style="{ left: playerProgress }"
        >
          <i class="fas fa-circle"></i>
        </span>
        <!-- Player Progress Bar-->
        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          :style="{ width: playerProgress }"
        ></span>
      </div>
      <!-- Duration -->
      <div class="player-duration">{{ duration }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import usePlayerStore from '../stores/player'

const playerStore = usePlayerStore()
const seek = computed(() => {
  return playerStore.seek
})
const duration = computed(() => {
  return playerStore.duration
})
const playing = computed(() => {
  return playerStore.playing
})
const playerProgress = computed(() => {
  return playerStore.playerProgress
})

function updateSeek(event) {
  playerStore.updateSeek(event)
}
</script>

<style lang="scss" scoped></style>

<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <upload-file ref="upload" :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <composition-item
              v-for="(song, index) in songs"
              :key="song.docID"
              :updateSong="updateSong"
              :song="song"
              :index="index"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import useUserStore from '@/stores/user'
import { onBeforeRouteLeave } from 'vue-router'

const userStore = useUserStore()

export default {
  beforeRouteEnter(to, from, next) {
    if (userStore.isUserLoggedIn) {
      next()
    } else {
      next({ name: 'home' })
    }
  }
}
</script>

<script setup>
import { ref } from 'vue'
import UploadFile from '@/components/UploadFile.vue'
import CompositionItem from '@/components/CompositionItem.vue'
import { songsCollection, auth } from '@/includes/firebase'

const songs = ref([])
const unsavedFlag = ref(false)

async function created() {
  const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get()

  snapshot.forEach(addSong)
}
function addSong(document) {
  const song = {
    ...document.data(),
    docID: document.id
  }
  songs.value.push(song)
}
function updateSong(i, values) {
  songs.value[i].modifiedName = values.modifiedName
  songs.value[i].genre = values.genre
}
function updateUnsavedFlag(value) {
  unsavedFlag.value = value
}
function removeSong(index) {
  songs.value.splice(index, 1)
}
created()
onBeforeRouteLeave((to, from, next) => {
  if (unsavedFlag.value === false) {
    next()
  } else {
    const leave = confirm('You have unsaved changes. Are you sure you want to leave?')
    next(leave)
  }
})
</script>
<style lang="scss" scoped></style>

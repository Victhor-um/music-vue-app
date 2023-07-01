<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">{{ $t('upload.upload') }}</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
  </div>
  <div class="p-6">
    <!-- Upload Dropbox -->
    <div
      class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
      :class="{ 'bg-green-400 border-green-400 border-solid': isDragOver }"
      @drag.prevent.stop=""
      @dragstart.prevent.stop=""
      @dragend.prevent.stop="isDragOver = false"
      @dragover.prevent.stop="isDragOver = true"
      @dragenter.prevent.stop="isDragOver = true"
      @dragleave.prevent.stop="isDragOver = false"
      @drop.prevent.stop="upload($event)"
    >
      <h5>{{ $t('upload.drop_files') }}</h5>
    </div>

    <!-- Define your button -->
    <button
      class="block w-full bg-blue-500 text-white mt-3 py-0.5 px-3 rounded"
      style="display: block; height: 30px"
      onclick="document.getElementById('fileInput').click()"
    >
      {{ $t('upload.chooseFiles') }}
    </button>
    <!-- Your File element -->
    <input type="file" id="fileInput" multiple @change="upload($event)" style="display: none" />

    <hr class="my-6" />
    <!-- Progress Bars -->
    <div class="mb-4" v-for="upload in uploads" :key="upload.name">
      <!-- File Name -->
      <div class="font-bold text-sm" :class="upload.textClass">
        <i :class="upload.icon"></i>{{ upload.name }}
      </div>
      <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
        <!-- Inner Progress Bar -->
        <div
          class="transition-all progress-bar"
          :class="upload.variant"
          :style="{ width: upload.currentProgress + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { storage, auth, songsCollection } from '@/includes/firebase'

const props = defineProps({
  addSong: {
    type: Function,
    required: true
  }
})

const isDragOver = ref(false)
const uploads = ref([])

function upload($event) {
  isDragOver.value = false
  const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files]

  files.forEach((file) => {
    if (file.type !== 'audio/mpeg') {
      return
    }

    if (!navigator.onLine) {
      uploads.value.push({
        task: {},
        currentProgress: 100,
        name: file.name,
        variant: 'bg-red-400',
        icon: 'fas fa-times',
        textClass: 'text-red-400'
      })
      return
    }
    const storageRef = storage.ref()

    const songsRef = storageRef.child(`songs/${file.name}`)

    const task = songsRef.put(file)

    const uploadIndex =
      uploads.value.push({
        task,
        currentProgress: 0,
        name: file.name,
        variant: 'bg-blue-400',
        icon: 'fas fa-spinner fa-spin',
        textClass: ''
      }) - 1

    task.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

        uploads.value[uploadIndex].currentProgress = progress
      },
      (error) => {
        uploads.value[uploadIndex].variant = 'bg-red-400'
        uploads.value[uploadIndex].icon = 'fas fa-times'
        uploads.value[uploadIndex].textClass = 'text-red-400'
        console.log(error)
      },
      async () => {
        const song = {
          uid: auth.currentUser.uid,
          displayName: auth.currentUser.displayName,
          originalName: task.snapshot.ref.name,
          modifiedName: task.snapshot.ref.name,
          genre: '',
          commentCount: 0
        }

        song.url = await task.snapshot.ref.getDownloadURL()
        const songRef = await songsCollection.add(song)
        const songSnapshot = await songRef.get()

        props.addSong(songSnapshot)

        uploads.value[uploadIndex].variant = 'bg-green-400'
        uploads.value[uploadIndex].icon = 'fas fa-check'
        uploads.value[uploadIndex].textClass = 'text-green-400'
      }
    )
  })
}

onBeforeUnmount(() => {
  uploads.value.forEach((upload) => {
    upload.task.cancel()
  })
})
</script>

<style lang="scss" scoped></style>

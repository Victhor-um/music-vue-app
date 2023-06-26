<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong(song)"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="toggleForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div class="text-white text-center font-bold p-4 mb-4" :class="alertVariant" v-if="showAlert">
        {{ alertMessage }}
      </div>
      <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
        <div class="mb-3">
          <label class="inline-block mb-2">{{ song.modifiedName }}</label>
          <vee-field
            name="modifiedName"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="songTitle" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">{{ song.genre }}</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="inSubmission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="inSubmission"
          @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { songsCollection, storage } from '@/includes/firebase'

const props = defineProps({
  song: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  updateSong: {
    type: Function,
    required: true
  },
  removeSong: {
    type: Function,
    required: true
  },
  updateUnsavedFlag: {
    type: Function
  }
})
const inSubmission = ref(false)
const showAlert = ref(false)
const alertVariant = ref('bg-blue-500')
const alertMessage = ref('Please wait! Updating song info.')
const schema = {
  modifiedName: 'required|max:100',
  genre: 'alpha_spaces'
}

async function deleteSong(song) {
  const storageRef = storage.ref()
  const songRef = storageRef.child(`songs/${song.originalName}`)

  await songRef.delete()

  await songsCollection.doc(song.docID).delete()

  props.removeSong(props.index)
}
async function edit(values) {
  inSubmission.value = true
  showAlert.value = true
  alertVariant.value = 'bg-blue-500'
  alertMessage.value = 'Please wait! Updating song info.'

  try {
    await songsCollection.doc(props.song.docID).update(values)
  } catch (error) {
    inSubmission.value = false
    showAlert.value = true
    alertVariant.value = 'bg-red-500'
    alertMessage.value = 'Something went wrong! Try again later.'
    return
  }
  props.updateSong(props.index, values)
  inSubmission.value = false
  alertVariant.value = 'bg-green-500'
  alertMessage.value = 'Success!'
  props.updateUnsavedFlag(false)
}
function toggleForm() {
  showForm.value = !showForm.value
}
const showForm = ref(false)
</script>

<style lang="scss" scoped></style>

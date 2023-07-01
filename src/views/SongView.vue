<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="newSong"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">{{ $n(1, 'currency') }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title"
            >{{ $t('song.comment_count', song.commentCount, { count: song.commentCount }) }}
          </span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if="commentShowAlert"
            :class="commentAlertVariant"
          >
            {{ commentAlertMessage }}
          </div>
          <vee-form :validation-schema="schema" @submit="addComment">
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              :placeholder="$t('song.commentPlaceholder')"
              v-if="userStore.isUserLoggedIn"
            ></vee-field>
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="commentInSubmission"
            >
              {{ $t('song.submit') }}
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">{{ $t('song.latest') }}</option>
            <option value="2">{{ $t('song.oldest') }}</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        v-for="comment in sortedComments"
        :key="comment.docID"
        class="p-6 bg-gray-50 border border-gray-200"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>
        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script setup>
import { songsCollection, auth, commentsCollection } from '@/includes/firebase'
import { ErrorMessage } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useUserStore from '@/stores/user'
import usePlayerStore from '@/stores/player'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const playerStore = usePlayerStore()

const song = ref({})
const comments = ref([])
const sort = ref('1')
const commentInSubmission = ref(false)
const commentShowAlert = ref(false)
const commentAlertVariant = ref('bg-blue-500')
const commentAlertMessage = ref(t('login.commentSubmitted'))

const schema = {
  comment: 'required|min:3'
}
watch(sort, (newVal) => {
  if (newVal === route.query.sort) {
    return
  }
  router.push({
    query: {
      sort: newVal
    }
  })
})
function newSong() {
  playerStore.newSong(song.value)

  playerStore.toggleAudio()
}
async function created() {
  const docSnapshot = await songsCollection.doc(route.params.id).get()

  if (docSnapshot.exist) {
    router.push({ name: 'home' })
    return
  }
  let { sort: sortQuery } = route.query

  sort.value = sortQuery === '1' || sortQuery === '2' ? sortQuery : '1'

  song.value = docSnapshot.data()
  getComments()
}
const sortedComments = computed(() => {
  return comments.value.toSorted((a, b) => {
    if (sort.value === '1') {
      return new Date(b.datePosted) - new Date(a.datePosted)
    }
    return new Date(a.datePosted) - new Date(b.datePosted)
  })
})
async function getComments() {
  const snapshots = await commentsCollection.where('sid', '==', route.params.id).get()

  comments.value = []

  snapshots.forEach((doc) => {
    comments.value.push({
      docID: doc.id,
      ...doc.data()
    })
  })
}

async function addComment(values, { resetForm }) {
  commentInSubmission.value = true
  commentShowAlert.value = true
  commentAlertVariant.value = 'bg-blue-500'
  commentAlertMessage.value = t('login.commentSubmitted')

  const comment = {
    content: values.comment,
    datePosted: new Date().toString(),
    sid: route.params.id,
    name: auth.currentUser.displayName,
    uid: auth.currentUser.uid
  }

  await commentsCollection.add(comment)

  song.value.commentCount += 1
  await songsCollection.doc(route.params.id).update({
    commentCount: song.value.commentCount
  })

  getComments()

  commentInSubmission.value = false
  commentAlertVariant.value = 'bg-green-500'
  commentAlertMessage.value = t('login.commentAdd')

  resetForm()
}

created()
</script>

<style lang="scss" scoped></style>

<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
        >Music</router-link
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <li>
            <router-link class="px-2 text-white" :to="{ name: 'about' }">About </router-link>
          </li>
          <!-- Navigation Links -->
          <li v-if="!userStore.isUserLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >Login / Register
            </a>
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">Manage</router-link>
            </li>
            <li>
              <a class="px-2 text-white" @click.prevent="signOut" href="#">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import useModalStore from '@/stores/modal'
import useUserStore from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'

const userStore = useUserStore()
const modalStore = useModalStore()

const route = useRoute()
const router = useRouter()

function toggleAuthModal() {
  modalStore.toggleIsOpen()
}
const signOut = () => {
  userStore.signOut()

  if (route.meta.requiresAuth) {
    router.push({ name: 'home' })
  }
}
</script>

<style lang="scss" scoped></style>

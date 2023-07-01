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
            <router-link class="px-2 text-white" :to="{ name: 'about' }"
              >{{ $t('header.about') }}
            </router-link>
          </li>
          <!-- Navigation Links -->
          <li v-if="!userStore.isUserLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >{{ $t('header.login-register') }}
            </a>
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">{{
                $t('header.manage')
              }}</router-link>
            </li>
            <li>
              <a class="px-2 text-white" @click.prevent="signOut" href="#">{{
                $t('header.logout')
              }}</a>
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li>
            <a href="#" class="px-2 text-white" @click.prevent="changeLocale">
              {{ currentLocale }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import useModalStore from '@/stores/modal'
import useUserStore from '@/stores/user'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const userStore = useUserStore()
const modalStore = useModalStore()

const route = useRoute()
const router = useRouter()

let { locale } = useI18n()

const currentLocale = computed(() => {
  return locale.value === 'ru' ? 'Russian' : 'English'
})

function toggleAuthModal() {
  modalStore.toggleIsOpen()
}
const signOut = () => {
  userStore.signOut()

  if (route.meta.requiresAuth) {
    router.push({ name: 'home' })
  }
}
function changeLocale() {
  locale.value = locale.value === 'ru' ? 'en' : 'ru'
}
</script>

<style lang="scss" scoped></style>

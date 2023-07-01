<template>
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="loginShowAlert"
    :class="loginAlertVariant"
  >
    {{ loginAlertMsg }}
  </div>
  <vee-form :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('login.email') }}</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="t('login.emailPlaceholder')"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('login.password') }}</label>
      <vee-field
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="t('login.passwordPlaceholder')"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="loginInSubmission"
    >
      {{ $t('login.submit') }}
    </button>
  </vee-form>
</template>

<script setup>
import { ref } from 'vue'
import useUserStore from '@/stores/user'
import useModalStore from '@/stores/modal'
import { useI18n } from 'vue-i18n'

const modalStore = useModalStore()
const userStore = useUserStore()
const { t } = useI18n()

const loginInSubmission = ref(false)
const loginShowAlert = ref(false)
const loginAlertVariant = ref('bg-blue-500')
const loginAlertMsg = ref(t('login.waitMessage'))

import { ErrorMessage } from 'vee-validate'

const loginSchema = {
  email: 'required|min:3|max:100|email',
  password: 'required|min:6|max:100|'
}

async function login(values) {
  loginInSubmission.value = true
  loginShowAlert.value = true
  try {
    await userStore.authenticate(values)
  } catch (error) {
    loginInSubmission.value = false
    loginAlertVariant.value = 'bg-red-500'
    loginAlertMsg.value = error.message
    return
  }

  loginAlertVariant.value = 'bg-green-500'
  loginAlertMsg.value = t('login.successMessage')
  setTimeout(() => {
    modalStore.toggleIsOpen()
    loginShowAlert.value = false
    loginInSubmission.value = false
    loginAlertVariant.value = 'bg-blue-500'
    loginAlertMsg.value = t('login.waitMessage')
  }, 0)
}
</script>

<style lang="scss" scoped></style>

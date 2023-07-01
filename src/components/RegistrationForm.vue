<template>
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="regShowAlert"
    :class="regAlertVariant"
  >
    {{ regAlertMsg }}
  </div>
  <vee-form :validation-schema="schema" @submit="register" :initial-values="userData">
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('register.name') }}</label>
      <vee-field
        name="name"
        type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('register.namePlaceholder')"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('register.email') }}</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('register.emailPlaceholder')"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('register.age') }}</label>
      <vee-field
        name="age"
        type="number"
        min="18"
        max="100"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('register.password') }}</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('login.passwordPlaceholder')"
          v-bind="field"
        />
        <div class="text-red-600" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('register.password_confirm') }}</label>
      <vee-field
        name="confirm_password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('register.confirmPasswordPlaceholder')"
      />
      <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('register.country') }}</label>
      <vee-field
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">{{ $t('register.USA') }}</option>
        <option value="Mexico">{{ $t('register.Mexico') }}</option>
        <option value="Germany">{{ $t('register.Germany') }}</option>
        <option value="Antarctica">{{ $t('register.Antarctica') }}</option>
      </vee-field>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        value="true"
        name="tos"
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <i18n-t class="inline-block" keypath="register.accept" tag="label">
        <a href="#">{{ $t('register.tos') }}</a>
      </i18n-t>
      <div>
        <ErrorMessage class="text-red-600" name="tos" />
      </div>
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="regInSubmission"
    >
      {{ $t('register.submit') }}
    </button>
  </vee-form>
</template>

<script setup>
import { ref } from 'vue'
import { ErrorMessage } from 'vee-validate'
import useUserStore from '@/stores/user'
import useModalStore from '@/stores/modal'
import { useI18n } from 'vue-i18n'

const modalStore = useModalStore()
const userStore = useUserStore()

const { t } = useI18n()
const schema = {
  name: 'required|min:3|max:100|alpha_spaces',
  email: 'required|min:3|max:100|email',
  age: 'required|min_value:18|max_value:100',
  password: 'required|min:6|max:100|excluded:password',
  confirm_password: 'passwords_mismatch:@password',
  country: 'required|country_excluded:Antarctica',
  tos: 'tos'
}

const userData = {
  country: 'USA'
}

const regInSubmission = ref(false)
const regShowAlert = ref(false)
const regAlertVariant = ref('bg-blue-500')
const regAlertMsg = ref(t('register.waitMessage'))

async function register(values) {
  regShowAlert.value = true
  regInSubmission.value = true

  try {
    await userStore.register(values)
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      regAlertVariant.value = 'bg-red-500'
      regAlertMsg.value = error.message
    } else {
      regAlertVariant.value = 'bg-red-500'
      regAlertMsg.value = t('register.errorMessage')
    }
    return
  } finally {
    regInSubmission.value = false
  }

  regAlertVariant.value = 'bg-green-500'
  regAlertMsg.value = t('register.successMessage')
  setTimeout(() => {
    modalStore.toggleIsOpen()
  }, 150)
}
</script>

<style lang="scss" scoped></style>

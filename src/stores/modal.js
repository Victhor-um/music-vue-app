import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('modal', {
  state: () => ({
    isOpen: false
  }),
  getters: {
    hiddenClass(state) {
      return !state.isOpen ? 'hidden' : ''
    }
  },
  actions: {
    toggleIsOpen() {
      this.isOpen = !this.isOpen
    }
  }
})

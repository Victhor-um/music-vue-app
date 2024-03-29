import { defineStore } from 'pinia'
import { auth, usersCollection } from '@/includes/firebase'

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false
  }),
  getters: {
    isUserLoggedIn() {
      return this.userLoggedIn
    }
  },
  actions: {
    async register(values) {
      const userCred = await auth.createUserWithEmailAndPassword(values.email, values.password)

      await usersCollection
        .doc(userCred.user.uid)
        .set({
          name: values.name,
          email: values.email,
          age: values.age,
          country: values.country
        })
        .then((userCred) => {
          auth.signInWithEmailAndPassword(userCred.email, userCred.password)
        })

      await userCred.user.updateProfile({
        displayName: values.name
      })

      this.setUserLoggedIn(true)
    },
    setUserLoggedIn(value) {
      this.userLoggedIn = value
    },
    async authenticate(values) {
      await auth.signInWithEmailAndPassword(values.email, values.password)

      this.setUserLoggedIn(true)
    },
    async signOut() {
      await auth.signOut()

      this.setUserLoggedIn(false)
    }
  }
})

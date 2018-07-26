export const checkAuthentication = {
  computed: {
    isAuthenticated () {
      return this.store.user !== null && this.store.user !== undefined
    },
    isVirAuthenticated () {
      return this.store.virUser !== null && this.store.virUser !== undefined
    },
    isPinAuthenticated () {
      return !localStorage.szefo_pin || localStorage.szefo_pin === this.store.pin
    }
  }
}

<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import API from './rest.js'
import Store from './store'
/*
 * Root component
 */
export default {
  data () {
    return {
      store: Store
    }
  },

  async created () {
    function urlParam (name) {
      const results = new RegExp('[\\?&]' + name + '=([^&#]*)', 'i').exec(window.location.href)
      return results ? results[1] : null
    }

    window.oncontextmenu = function (event) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }

    const token = urlParam('token_uid')
    if (token) {
      const response = await API.post('accounts/pulltoken/' + token)
      if (response.ok) {
        this.store.user = response.data.user
        API.setHeader('Authorization', response.data.loopback_token)
      }
      else {
        console.log(response.problem)
      }
    }
  }
}
</script>

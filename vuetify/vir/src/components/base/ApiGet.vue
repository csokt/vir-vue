<script>
import { API, checkResponse } from '@/util'

export default {
  props: {
    value: Array,
    reloadTrigger: Boolean,
    apiUrl: String
  },

  watch: {
    reloadTrigger: function () {
      this.apiGet()
    },
    apiUrl: function () {
      this.apiGet()
    }
  },

  methods: {
    async apiGet () {
      const response = await API.get(this.apiUrl)
      if (!checkResponse(response)) return
      this.$emit('input', response.data)
    }
  },

  render: function (h) {
    return h() // avoid warning message
  }
}
</script>

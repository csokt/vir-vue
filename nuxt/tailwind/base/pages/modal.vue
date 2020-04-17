<template>
  <div>
    Modal components
    <br />
    <t-button @click="onClick" value="Default"></t-button>
    <t-modal v-model="dialog" @close="dialog = false" header="Modal header">
      Lorem ipsum dolor sit amet ...
      <br />
      Lorem ipsum ...
      <br />
      Lorem ipsum ...
      <br />
      Lorem ipsum ...
      <br />
      Lorem ipsum ...
      <br />
      Lorem ipsum ...
      <br />
      Lorem ipsum ...
      <br />
      Lorem ipsum ...
      <br />
      Lorem ipsum ...
      <br />
      Lorem ipsum ...
      <br />
      Lorem ipsum ...
      <br />
      Lorem ipsum ...
      <br />
      <template v-slot:footer>
        Modal footer
      </template>
    </t-modal>
  </div>
</template>

<script>
// @ is an alias to /src
import TButton from '@/components/ui/TButton.vue'
import TModal from '@/components/ui/TModal.vue'

export default {
  name: 'Modal',
  components: {
    TButton,
    TModal
  },

  data() {
    return {
      dialog: false
    }
  },

  methods: {
    onClick() {
      this.dialog = !this.dialog
      // eslint-disable-next-line
      console.log('parent')
    }
  }
}
</script>

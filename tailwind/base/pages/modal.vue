<template>
  <div>
    Modal components
    <br />
    <t-modal @click="onClick" value="Default"></t-modal>
    <t-modal value="Disabled" disabled> </t-modal>
    <t-modal value="With icon">
      <template #icon>😊</template>
    </t-modal>
  </div>
</template>

<script>
// @ is an alias to /src
import TModal from '@/components/ui/TModal.vue'

export default {
  name: 'Modal',
  components: {
    TModal
  },

  methods: {
    onClick() {
      // eslint-disable-next-line
      console.log('parent')
    }
  }
}
</script>

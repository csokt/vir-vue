<template>
  <div>
    Button components
    <br />
    <t-button @click="onClick" value="Default"></t-button>
    <t-button value="Disabled" disabled> </t-button>
    <t-button value="With icon">
      <template #icon>😊</template>
    </t-button>
    <t-button value="Info" color="info"> </t-button>
    <t-button value="Success" color="success"> </t-button>
    <t-button value="Warning" color="warning"> </t-button>
    <t-button value="Error" color="error"> </t-button>
  </div>
</template>

<script>
// @ is an alias to /src
import TButton from '@/components/ui/TButton.vue'

export default {
  name: 'Button',
  components: {
    TButton
  },

  methods: {
    onClick() {
      // eslint-disable-next-line
      console.log('parent')
    }
  }
}
</script>

<template>
  <div>
    Input components
    <br />
    <t-input v-model="username" @click="onClick" label="Default"></t-input>
    <t-input v-model="username" type="search" label="Search"></t-input>
    <t-input v-model="username" type="number" label="Number"></t-input>
    <t-input v-model="username" readonly label="Readonly"></t-input>
    <t-input v-model="username" disabled label="Disabled"></t-input>
    <t-input v-model="username" type="password" label="Password"></t-input>
    <t-input v-model="username" placeholder="No label"></t-input>
    <t-checkbox v-model="member" label="Checkbox"></t-checkbox>
    <t-checkbox v-model="member" readonly label="Readonly"></t-checkbox>
    <t-checkbox v-model="member" disabled label="Disabled"></t-checkbox>
  </div>
</template>

<script>
// @ is an alias to /src
import TInput from '@/components/ui/TInput.vue'
import TCheckbox from '@/components/ui/TCheckbox.vue'

export default {
  name: 'Input',
  components: {
    TInput,
    TCheckbox
  },

  data() {
    return {
      username: '',
      member: true
    }
  },

  methods: {
    onClick() {
      // eslint-disable-next-line
      console.log('Clicked')
    }
  }
}
</script>

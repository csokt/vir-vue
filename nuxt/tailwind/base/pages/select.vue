<template>
  <div>
    Select components
    <br />
    <t-select v-model="car" :options="options" label="Default"></t-select>
    <t-select
      v-model="car"
      :options="options"
      label="Clearable"
      clearable
    ></t-select>
    <t-select
      v-model="car"
      :options="options"
      label="Disabled"
      disabled
    ></t-select>
  </div>
</template>

<script>
// @ is an alias to /src
import TSelect from '@/components/ui/TSelect.vue'

export default {
  name: 'Input',
  components: {
    TSelect
  },

  data() {
    return {
      car: null,
      options: [
        { value: 'volvo1', label: 'Volvo1' },
        { value: 'saab1', label: 'Saab1' },
        { value: 'fiat1', label: 'Fiat1' },
        { value: 'audi1', label: 'Audi1' },
        { value: 'volvo2', label: 'Volvo2' },
        { value: 'saab2', label: 'Saab2' },
        { value: 'fiat2', label: 'Fiat2' },
        { value: 'audi2', label: 'Audi2' },
        { value: 'volvo3', label: 'Volvo3' },
        { value: 'saab3', label: 'Saab3' },
        { value: 'fiat3', label: 'Fiat3' },
        { value: 'audi3', label: 'Audi3' }
      ]
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

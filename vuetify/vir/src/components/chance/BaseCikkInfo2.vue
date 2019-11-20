<template>
  <div>
    <v-textarea
      v-model="cikk.vonalkod"
      label="Vonalkód"
      rows="1"
      auto-grow
      readonly
    />
    <v-textarea
      v-model="cikk.name"
      label="Cikkazonosító"
      rows="1"
      auto-grow
      readonly
    />
  </div>
</template>

<script>
export default {
  props: {
    cikk: Object
  }
}
</script>

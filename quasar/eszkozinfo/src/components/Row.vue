<template>
  <div>
    <hr>
    <div> <b> {{label}} </b> </div>
    <div> <slot> </slot> </div>
    <div class="message"> {{message}} </div>
  </div>
</template>

<script>

export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.message {
  color:red;
  font-size: 150%;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
}
</style>

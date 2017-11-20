<template>
  <div class="field">
    <label class="label is-large">{{label}}</label>
    <div class="control">
      <slot> </slot>
    </div>
  </div>
</template>

<!--
  <div class="field is-horizontal">
    <div class="field-label is-normal">
      <label class="label">{{label}}</label>
    </div>
    <div class="field-body">
      <div class="field">
        <div class="control">
          <slot> </slot>
        </div>
      </div>
    </div>
  </div>
-->

<script>

export default {
  props: {
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

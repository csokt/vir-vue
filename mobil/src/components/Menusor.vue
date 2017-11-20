<template>
  <div>
    <div class="table menusor" @click="clickMenusor">
      <img :src="img">
      <span class="td" :class="[ location ? 'menufont' : 'headerfont', location, { clicked: isClicked } ]">
        {{name}}
      </span>
    </div>
    <hr>
  </div>

</template>

<script>

export default {
  props: {
    img: {
      type: String
    },
    name: {
      type: String
    },
    location: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isClicked: false
    }
  },
  methods: {
    clickMenusor () {
      if (this.location) {
        this.isClicked = true
        setTimeout(() => { this.isClicked = false }, 1000)
        location.assign(this.location)
      }
    }
  }
}
</script>

<style scoped>
.headerfont {
  vertical-align: middle;
  color:blue;
  font-size: 200%;
}
.menufont {
  vertical-align: middle;
  font-size: 150%;
}
.menusor {
  height: 60px;
}
.table {
  display: table;
}
.tr{
  display: table-row;
}
.td{
  display: table-cell;
}
img {
  margin-right: 1em;
}
.clicked {
  background-color: aqua;
}
</style>

<template>
  <v-list>
    <template v-for="(item, index) in items">
      <v-divider :key="index"></v-divider>
      <v-list-tile
        :key="item.fullpath"
        @click.stop="onClick(item)"
      >
        <v-list-tile-content>
          <v-list-tile-title v-text="item.name"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
  </v-list>
</template>

<script>
export default {
  props: {
    items: Array
  },

  methods: {
    onClick (item) {
      // Log('show', {file: item.fullpath})
      const publicUrl = 'https://mobilszefo.hopto.org:19540/d/2e2d6b2c61fb4acdb9e2/'
      let win = window.open(publicUrl + 'files/?p=' + item.fullpath, '_blank')
      if (win) {
        win.focus()
      } else {
        alert('Engedélyezze a felugró ablakokat ezen az oldalon!')
      }
    }
  }
}
</script>

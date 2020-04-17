<template>
  <v-app>
    <v-app-bar
      height="48"
      color="blue darken-1"
      fixed
      app
    >
      <v-btn
        @click.stop="$router.go(-1)"
        icon
      >
        <span class="title">
          &#9664;&nbsp;&nbsp;&nbsp;
        </span>
      </v-btn>
      <v-spacer />
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
  <!-- icon &#119638; &#12274; -->
  <!-- <v-icon>mdi-arrow-left</v-icon> -->
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  }
}
</script>

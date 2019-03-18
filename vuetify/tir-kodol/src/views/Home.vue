<template>
  <v-container pa-0>
    <v-layout justify-space-around wrap>
      <BaseCard v-if="user.name">
        <BaseMenu :items="showItems"/>
        <v-card-actions>
          <v-btn color="primary" @click="logout">Másik felhasználó választása</v-btn>
        </v-card-actions>
      </BaseCard>

      <BaseCard v-if="!user.name" title="Kérem jelentkezzen be!">
        <v-card-text>
          <BaseQfield v-model="qrcode"  @change="gotUserQR"/>
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
<!--
      <v-btn color="primary" @click="restartBackend">Restart backend</v-btn>
-->
</template>

<script>
import { get } from 'vuex-pathify'
import { API, checkResponse } from '@/util'
import BaseCard from '@/components/core/BaseCard.vue'
import BaseMenu from '@/components/core/BaseMenu.vue'
import BaseQfield from '@/components/core/BaseQfield.vue'

export default {
  name: 'home',
  components: {
    BaseCard,
    BaseMenu,
    BaseQfield
  },

  data () {
    return {
      qrcode: '',
      dolgozo: {}
    }
  },

  computed: {
    ...get(['user']),

    showItems () {
      if (!this.user.name) return []
      const items = [
        { show: true, path: '/kodol', icon: 'info', title: 'Kódolás' },
        { show: false, path: '/atad', icon: 'info', title: 'Átadás' },
        { show: true, path: '/munkalap', icon: 'info', title: 'Munkalap információk' },
        { show: true, path: '/seasearch', icon: 'info', title: 'Dokumentációk' },
        { show: true, path: '/norma', icon: 'info', title: 'Mai teljesítmény %' },
        { show: true, path: '/tablazatok', icon: 'info', title: 'Táblázatok' }
      ]
      return items.filter(item => item.show)
    }
  },

  methods: {
    async gotUserQR (value) {
      if (!value) {
        return
      }
      const response = await API.post('tir/belep/' + value)
      if (!checkResponse(response)) return
      if (response.ok) {
        this.$store.set('defaults@belepokod', value)
        this.$store.set('user', response.data.user)
        this.$store.set('kodol', response.data.kodol)
      }
    },

    logout () {
      // Log('logout', this.store.user)
      this.$store.set('user', {})
      this.$store.set('kodol', {})
      this.$store.set('infok', [])
    }
  },

  created () {
    this.$store.set('pageTitle', 'Termelés Információs Rendsz.')
  }
}
</script>

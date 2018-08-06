<template>
  <v-flex xs12 sm8 md5>
    <v-card class="elevation-12">
      <v-card-title> <div class="title grey--text">Távirányító</div> </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="tv.label"
          solo
          readonly
          :background-color="tv.reachable ? 'teal' : 'grey'"
        ></v-text-field>

        <v-container grid-list-md text-xs-center>
          <v-layout row wrap>
            <v-flex xs4>
              <v-btn fab color="red" @click="$emit('select', 'power')">
                <v-icon>power_settings_new</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs4>
              <v-btn fab @click="$emit('select', 'pointerbutton', 'BACK')">
                <v-icon>settings_backup_restore</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs4>
              <v-btn fab @click="$emit('select', 'pointerbutton', 'EXIT')">
                <v-icon>exit_to_app</v-icon>
              </v-btn>
            </v-flex>

            <v-flex xs4>
              <v-btn fab @click="$emit('select', 'volumeup')">
                <v-icon>volume_up</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs4>
              <v-btn fab @click="$emit('select', 'pointerbutton', 'UP')">
                <v-icon>keyboard_arrow_up</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs4>
              <v-btn fab @click="$emit('select', 'pointerbutton', 'HOME')">
                <v-icon>home</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs4>
              <v-btn fab @click="$emit('select', 'pointerbutton', 'LEFT')">
                <v-icon>keyboard_arrow_left</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs4>
              <v-btn fab @click="$emit('select', 'pointerbutton', 'ENTER')">
                OK
              </v-btn>
            </v-flex>
            <v-flex xs4>
              <v-btn fab @click="$emit('select', 'pointerbutton', 'RIGHT')">
                <v-icon>keyboard_arrow_right</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs4>
              <v-btn fab @click="$emit('select', 'volumedown')">
                <v-icon>volume_down</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs4>
              <v-btn fab @click="$emit('select', 'pointerbutton', 'DOWN')">
                <v-icon>keyboard_arrow_down</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs4>
              <v-btn fab @click="$emit('select', 'mute', 'true')">
                <v-icon>volume_off</v-icon>
              </v-btn>
            </v-flex>

          </v-layout>
        </v-container>

          <v-btn round @click="$emit('select', 'fullscreen')">
            teljes képernyő
          </v-btn>

          <v-btn round @click="$emit('select', 'startapp', 'miracast')">
            <v-icon></v-icon>
            tablet tükrözés
          </v-btn>
          <v-btn round @click="$emit('select', 'startapp', 'photovideo')">
            <v-icon></v-icon>
            technológiai videók
          </v-btn>

      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'remote',
  props: {
    tv: Object
  }
}
</script>

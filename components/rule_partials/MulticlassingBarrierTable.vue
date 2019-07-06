<template lang="pug">
  table.table
    thead
      tr
        th Level
        th Barrier Ticks
    tbody
      tr(v-for="level in vanguardProgression" v-bind:key="level.level")
        td(data-table-key="Level") {{ level.level | ordinal }}
        td(data-table-key="Barrier Ticks") {{ level.barrierTicks }}
</template>

<script>
  import vanguardProgression from '~/static/data/general/progressions/vanguard.json'

  export default {
    data () {
      return {
        vanguardProgression
      }
    }
  }
</script>

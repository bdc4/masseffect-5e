<template lang="pug">
  table.table
    thead
      tr
        th Property
        th Mechanic
    tbody
      tr(v-for="property in weaponProperties" v-bind:key="property.name")
        td(data-table-key="Property") {{ property.name }}
        td(data-table-key="Mechanic") {{ property.description }}
</template>

<script>
  export default {
    computed: {
      weaponProperties() {
        return this.$store.getters.content[this.$i18n.locale].weaponProperties
      }
    }
  }
</script>

<template lang="pug">
  div
    div(v-for="thing in items" v-bind:key="thing.type").mb-3
      p.title.mt-5 {{ thing.type }}
      v-data-table(v-bind:headers="headers" v-bind:items="thing.items" hide-actions).mt-0
        template(slot="items" slot-scope="props")
          td {{ props.item.name }}
          td {{ props.item.cost }}
</template>

<script>
  export default {
    data () {
      return {
        headers: [
          { text: 'Item', value: 'item', align: 'left', sortable: false },
          { text: 'Credits', value: 'credits', sortable: false, align: 'left' }
        ]
      }
    },
    computed: {
      items () {
        return this.$store.getters.content[this.$i18n.locale].commonplaceItems
      }
    }
  }
</script>

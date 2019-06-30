<template lang="pug">
  v-card(:id="hash").elevation-0.transparent
    v-card-title.headline {{ title }}
      v-chip(v-if="newRule" color="secondary" text-color="white" small) new
      v-chip(v-if="changeRule" color="orange accent-2" text-color="black" small) change
    v-card-text
      markdown-content(:source="item.html")
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        default: ''
      }
    },
    computed: {
      item () {
        return this.$store.getters.getContent('rules', this.id)
      },
      title () {
        return this.item.title
      },
      newRule () {
        return this.item.new
      },
      changeRule () {
        return this.item.change
      },
      hash () {
        return this.id.split('-').splice(2).join('-')
      }
    }
  }
</script>

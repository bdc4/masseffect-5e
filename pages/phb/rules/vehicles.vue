<template lang="pug">
  v-container
    h2.display-1.hidden-sm-and-down {{ title }} #[v-chip(color="secondary" text-color="white") new]
    div(v-for="(rule, index) in rules" v-bind:key="index")
      rule-card(:id="rule.id")
</template>

<script>
  import RuleCard from '~/components/RuleCard.vue'
  import {mapGetters} from 'vuex'

  export default {
    async fetch ({store}) {
      await store.dispatch('getContent', {context: 'rules'})
    },
    components: {RuleCard},
    computed: {
      ...mapGetters('phb', {
        version: 'version',
        pages: 'pages'
      }),
      rules () {
        return this.$store.getters.content.rules.filter(rule => rule.section === this.pages[this.$route.name].rules)
      },
      title () {
        return this.pages[this.$route.name].name
      }
    },
    head () {
      return {
        title: `${this.title} | Mass Effect 5e`,
        meta: [
          { hid: 'description', name: 'description', content: 'Learn how to travel between planets, systems, and clusters' }
        ]
      }
    },
    layout: 'phb'
  }
</script>

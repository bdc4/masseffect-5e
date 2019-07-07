<template lang="pug">
  v-content
    v-container(grid-list-xl).mt-5
      div.text-xs-center
        h1.display-2 Changelog
      v-layout(row wrap).mt-5
        v-flex(v-for="post in items" v-bind:key="post.slug" xs12 sm6 lg4 d-flex)
          post-card(:post="post" height="185px")
</template>

<script>
  import PostCard from '~/components/cards/PostCard.vue'

  export default {
    async fetch ({store}) {
      await store.dispatch('getContent', {lang: 'general', context: 'changelog'})
    },
    components: { PostCard },
    computed: {
      items () {
        return this.$store.getters.content.general.changelog
      }
    },
    head () {
      return {
        title: `Changelog | Mass Effect 5e`,
        meta: [
          { hid: 'description', name: 'description', content: 'Keep up-to-date with all the Mass Effect 5e system rule additions and updates.' }
        ]
      }
    },
    layout: 'dark'
  }
</script>

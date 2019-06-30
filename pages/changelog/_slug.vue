<template lang="pug">
  v-content.blue-grey.lighten-4
    v-container
      div.news-post
        h1.display-3 {{ post.title }}
        h2.subheading #[em {{ post.date | formatDate('DDDD, MMMM DD, YYYY') }}]
        div.markdown-content
          markdown-content(:source="post.html")
      v-btn(to="/changelog" nuxt).primary
        v-icon keyboard_arrow_left
        span Back to changelog
</template>

<script>
  export default {
    async fetch ({store}) {
      await store.dispatch('getContent', {context: 'changelog'})
    },
    data () {
      return {
        id: this.$route.params.slug
      }
    },
    computed: {
      post () {
        return this.$store.getters.getContent('changelog', this.id)
      }
    },
    head () {
      return {
        title: `${this.post.title} - Changelog | Mass Effect 5e`,
        meta: [
          { hid: 'description', name: 'description', content: this.post.description }
        ]
      }
    }
  }
</script>

<style lang="scss">
  .news-post .markdown-content {
    h2 {
      border-bottom: 1px solid gray;
      margin-top: 2em;
    }

    ul {
      margin-top: 0;
    }
  }
</style>

<template lang="pug">
  v-content
    section
      v-parallax(src="/images/parallax/milky_way.jpg" alt="The Milky Way")
        v-layout(column align-center justify-center).white--text
          me-header-logo
          h1.display-1.mt-5 About #[span.sr-only Mass Effect 5e]
    // Creators
    section
      v-layout(column wrap align-center).my-5
        v-flex(xs12 sm8).my-3
          div.text-xs-center
            h2.display-3.font-weight-light Creators
        v-flex(xs12)
          v-container(grid-list-xl)
            v-layout(row wrap)
              v-flex(xs12 md6 d-flex v-for="creator in creators" v-bind:key="creator.name")
                v-card.elevation-0.transparent
                  v-card-text.text-xs-center
                    v-avatar(size="128")
                      img(:src="creator.image" v-bind:alt="creator.name")
                  v-card-title(primary-title).layout.column.justify-center.text-xs-center.pb-0
                    v-flex.pb-0
                      div.headline {{ creator.name }}
                    v-flex.pt-1
                      div {{ creator.title }}
                  v-card-text.pt-0
                    p {{ creator.desc }}
    // Pro Contributors
    section
      v-layout(column wrap align-center).my-5
        v-flex(xs12 sm8).my-3
          div.text-xs-center
            h2.display-2.font-weight-light Pro Contributors
        v-flex(xs12)
          v-container(grid-list-xl)
            v-layout(row wrap justify-center)
              v-flex(xs12 sm6 md4 d-flex v-for="item in pros" v-bind:key="item.name")
                v-card.elevation-0.transparent
                  v-card-text.text-xs-center
                    v-avatar(size="92")
                      img(:src="item.image" v-bind:alt="item.name")
                  v-card-title(primary-title).layout.column.justify-center.text-xs-center.pb-0
                    v-flex.pb-0
                      div.headline {{ item.name }}
                  v-card-text.pt-0
                    p {{ item.desc }}
    // Contributors
    section
      v-layout(row wrap justify-center)
        v-flex(xs12 sm8).my-3
          div.text-xs-center
            h2.display-1.font-weight-light Contributors
            p.
              Thank you to everyone who has contributed to this system by sharing ideas, playtesting, creating assets,
              and much more!!!
        v-flex(xs12 sm8).mb-2
          v-list(three-line)
            template(v-for="item in shoutouts")
              v-list-tile(avatar v-bind:key="item.name")
                v-list-tile-avatar(size="48")
                  img(:src="item.image")
                v-list-tile-content
                  v-list-tile-title {{ item.name }}
                  v-list-tile-sub-title(v-html="item.desc")
              v-divider(inset)
        v-flex(xs12 sm8)
          v-card.elevation-0.transparent
            v-alert(type="info" v-bind:value="true" outline).
              If, we've missed anyone it was merely an oversight on our part and not intentional.
              Feel free to contact us and we'll be happy to give you a shout out. If you're on the list and want to be
              removed, have your name changed, or update your picture, contact us as well.
    section.mt-5.pt-5
      v-layout(row wrap justify-center).mt-5
        v-flex(xs12 sm8).my-2
          div.text-xs-center
            h2.headline Image Attributuions
            p.px-5.
              Finally, there are a host of Creative Commons images that I've used, so I'd like to attribute and thank
              these indirect contributors. Any images not listed were either created by Luke Aeschleman or come from the the
              #[a(href="http://masseffect.wikia.com/wiki/Mass_Effect_Wiki" target="_blank").blue--text.text--lighten-3  Mass Effect Wiki].
      v-container(grid-list-md)
        v-layout(row wrap)
          v-flex(v-for="att in attributions" v-bind:key="att.attribution" xs12 sm6 md4 lg3 d-flex)
            v-card(:href="att.source" v-bind:alt="att.title" target="_blank" hover)
              v-img(:src="att.path" height="200px" contain).blue-grey.lighten-5
              v-card-title(color="grey darken-3") {{ att.attribution }}
</template>

<script>
  import AboutCard from '~/components/cards/AboutCard.vue'

  export default {
    async fetch ({store}) {
      await store.dispatch('getContent', {lang: 'general', context: 'attributions'})
      await store.dispatch('getContent', {lang: 'general', context: 'contributors'})
    },
    components: {AboutCard},
    computed: {
      attributions () {
        return this.$store.getters.content.general.attributions
      },
      contributors () {
        return this.$store.getters.content.general.contributors
      },
      creators () {
        return this.contributors.creators
      },
      pros () {
        return this.contributors.pros
      },
      shoutouts () {
        return this.contributors.shoutouts
      },
    },
    head () {
      return {
        title: 'About | Mass Effect 5e',
        meta: [
          { hid: 'description', name: 'description', content: 'Learn more about the Mass Effect 5e creators and contributors.' }
        ]
      }
    },
    layout: 'dark'
  }
</script>

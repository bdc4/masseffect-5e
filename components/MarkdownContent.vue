<template lang="pug">
  div
    v-runtime-template(:template="`<div>${source}</div>`")
    // div [{{ component }}]
</template>

<script>
  import AiDialog from '~/components/rule_partials/AdditionalInformationDialog.vue'
  import SkillList from '~/components/rule_partials/SkillList.vue'
  import SourceReference from '~/components/rule_partials/SourceReference.vue'
  import CostOfThings from '~/components/rule_partials/CostOfThings.vue'
  import Condition from '~/components/Condition.vue'
  import VRuntimeTemplate from "v-runtime-template";

  export default {
    name: 'MarkdownContent',
    components: {
      AiDialog,
      SkillList,
      SourceReference,
      CostOfThings,
      Condition,
      VRuntimeTemplate
    },
    props: {
      source: {
        type: String,
        default: null
      },
      context: {
        type: Object,
        default: () => { return {} }
      }
    },
    computed: {
      level () {
        const level = this.ctx('level')
        return `${this.$options.filters.ordinal(level)}`
      },
    },
    methods: {
      ctx (key) {
        if (this.context) {
          return this.context[key] ? this.context[key] : key
        }
        return key
      }
    },
  }
</script>



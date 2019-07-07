export default {
  async getContent ({getters, commit}, {context}) {
    // TODO: need to solve how to get lang on load without switcher
    const lang = 'en'
    if (!getters.content[lang] || !getters.content[lang][context]) {
      const domain = getters.domain
      const url = `${domain}/data/${lang}/${context}.json`
      const data = await this.$axios.$get(url)
      commit('setContent', {content: data, lang, context})
    }
  },
  async getGeneralContent({getters, commit}) {
    const domain = getters.domain
    const url = `${domain}/data/general/${context}.json`
    const data = await this.$axios.$get(url)
    commit('setContent', {content: data, lang: 'general', context})
  },
  addBookmark ({commit}, payload) {
    commit('addBookmark', payload)
  },
  removeBookmark ({state, commit}, payload) {
    const index = state.bookmarks.findIndex(bookmark => bookmark.type === payload.type && bookmark.card.id === payload.card.id)
    if (index > -1) {
      commit('removeBookmark', index)
    }
  },
  toggleSidebar ({getters, commit}) {
    commit('toggleSidebar', !getters.sidebar)
  },
  toggleRulebar ({getters, commit}) {
    commit('setRulebar', !getters.rulebar)
  },
  setRulebar ({commit}, payload) {
    commit('setRulebar', payload)
  },
  setSearchbar ({commit}, payload) {
    commit('setSearchbar', payload)
  },
  setPhbSearch ({commit}, payload) {
    commit('setPhbSearch', payload)
  },
  setDev ({commit}, payload) {
    commit('setDev', payload)
  }
}

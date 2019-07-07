export default {
  async getContent ({getters, commit}, {lang, context}) {
    // TODO: need to solve how to get lang without switcher
    const contentLang = lang ? lang : getters.lang
    console.log(contentLang)
    if (!getters.content[contentLang] || !getters.content[contentLang][context]) {
      // TODO: can this be relative after build
      const domain = getters.isDev ? 'http://localhost:3000' : 'http://localhost:8000'
      const url = `${domain}/data/${contentLang}/${context}.json`
      const data = await this.$axios.$get(url)
      commit('setContent', {content: data, lang: contentLang, context})
    }
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

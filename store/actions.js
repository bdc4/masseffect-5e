export default {
  async getContent ({getters, commit}, {context}) {
    if (!getters.content[context]) {
      // TODO: can this be relative after build
      const domain = getters.isDev ? 'http://localhost:3000' : 'http://localhost:8000'
      const url = `${domain}/data/${context}.json`
      const data = await this.$axios.$get(url)
      commit('setContent', {content: data, context})
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
  },
  setContent ({commit}, context, payload) {
    commit('setContent', context, payload)
  }
}

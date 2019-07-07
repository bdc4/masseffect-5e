export default {
  bookmarkCount: (state, getters) => {
    return getters.bookmarks.length
  },
  bookmarks: state => state.bookmarks,
  bookmarksGroupedByType: (state, getters) => {
    return getters.bookmarks.reduce((rv, x) => {
      (rv[x.type] = rv[x.type] || []).push(x.card)
      return rv
    }, {})
  },
  getVersion: state => state.version,
  isBookmarked: (state, getters) => card => {
    return getters.bookmarks.find(bookmark => bookmark.card.id === card.id) !== undefined
  },
  mobileFilterDialog: state => state.mobileFilterDialog,
  primaryNavigation: state => state.primaryNavigation,
  sidebar: state => state.sidebar,
  rulebar: state => state.rulebar,
  searchbar: state => state.searchbar,
  races: state => state.races,
  phbSearch: state => state.phbSearch,
  searchFilters: state => state.searchFilters,
  isDev: state => state.isDev,
  domain: (state, getters) => {
    // TODO: can this be relative after build?
    return getters.isDev ? 'http://localhost:3000' : 'http://localhost:8000'
  },
  content: state => state.content,
  lang: state => state.lang,
  getContent: (state, getters) => (context, id) => {
    // TODO: need to solve how to get lang on load without switcher
    if (Array.isArray(state.content[getters.lang][context])) {
      return state.content[getters.lang][context].find(c => c.id === id)
    }
  }
}

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
  content: state => state.content,
  getContent: (state, getters) => (context, id) => {
    // TODO: if content doesn't exist, get from english and add translate tag
    if (Array.isArray(state.content[context])) {
      return state.content[context].find(c => c.id === id)
    }
  }
}

const state = {
  selectedArtwork: null,
  currentSlide: 0,
  contentTab: 'featured'
}

const mutations = {
  SET_SELECTED_ARTWORK(state, artwork) {
    state.selectedArtwork = artwork
  },
  SET_CURRENT_SLIDE(state, index) {
    state.currentSlide = index
  },
  SET_CONTENT_TAB(state, tab) {
    state.contentTab = tab
  }
}

const actions = {
  selectArtwork({ commit }, artwork) {
    commit('SET_SELECTED_ARTWORK', artwork)
  },
  closeModal({ commit }) {
    commit('SET_SELECTED_ARTWORK', null)
  },
  setCurrentSlide({ commit }, index) {
    commit('SET_CURRENT_SLIDE', index)
  },
  setContentTab({ commit }, tab) {
    commit('SET_CONTENT_TAB', tab)
  }
}

const getters = {
  selectedArtwork: state => state.selectedArtwork,
  currentSlide: state => state.currentSlide,
  contentTab: state => state.contentTab
}

export default { namespaced: true, state, mutations, actions, getters }
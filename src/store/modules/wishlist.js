const state = {
  items: []
}

const getters = {
  items: (state) => state.items,
  itemCount: (state) => state.items.length,
  isInWishlist: (state) => (productId) => {
    return state.items.some(item => item.id === productId)
  }
}

const mutations = {
  ADD_ITEM(state, product) {
    if (!state.items.some(item => item.id === product.id)) {
      state.items.push(product)
    }
  },
  REMOVE_ITEM(state, productId) {
    state.items = state.items.filter(item => item.id !== productId)
  },
  CLEAR_WISHLIST(state) {
    state.items = []
  }
}

const actions = {
  addItem({ commit }, product) {
    commit('ADD_ITEM', product)
  },
  removeItem({ commit }, productId) {
    commit('REMOVE_ITEM', productId)
  },
  clearWishlist({ commit }) {
    commit('CLEAR_WISHLIST')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

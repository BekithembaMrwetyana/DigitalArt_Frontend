const state = {
  items: [] // Now stores product IDs instead of full objects
}

const getters = {
  items: (state, getters, rootState, rootGetters) => {
    const allProducts = rootGetters['products/allProducts'] || []
    return state.items.map(id => allProducts.find(product => product.id === id)).filter(Boolean)
  },
  itemCount: (state) => state.items.length,
  isInWishlist: (state) => (productId) => {
    return state.items.includes(productId)
  }
}

const mutations = {
  ADD_ITEM(state, productId) {
    if (!state.items.includes(productId)) {
      state.items.push(productId)
    }
  },
  REMOVE_ITEM(state, productId) {
    state.items = state.items.filter(id => id !== productId)
  },
  CLEAR_WISHLIST(state) {
    state.items = []
  }
}

const actions = {
  addItem({ commit }, productId) {
    commit('ADD_ITEM', productId)
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

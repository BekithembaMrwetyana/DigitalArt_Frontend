import wishlistService from '@/services/WishlistService.js'

const state = {
  items: [], // Stores product IDs
  loading: false,
  error: null
}

const getters = {
  items: (state, getters, rootState, rootGetters) => {
    const allProducts = rootGetters['products/allProducts'] || []
    return state.items.map(id => allProducts.find(product => product.id === id)).filter(Boolean)
  },
  itemCount: (state) => state.items.length,
  isInWishlist: (state) => (productId) => {
    return state.items.includes(productId)
  },
  loading: (state) => state.loading,
  error: (state) => state.error
}

const mutations = {
  SET_ITEMS(state, items) {
    state.items = items
  },
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
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchWishlist({ commit, rootGetters }) {
    const user = rootGetters['auth/user']
    if (user && user.userId) {
      // Authenticated user: fetch from backend
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const productIds = await wishlistService.getWishlistByUser(user.userId)
        commit('SET_ITEMS', productIds)
      } catch (error) {
        commit('SET_ERROR', error.message)
        console.error('Failed to fetch wishlist:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    } else {
      // Guest user: load from sessionStorage
      const guestWishlist = JSON.parse(sessionStorage.getItem('guestWishlist') || '[]')
      commit('SET_ITEMS', guestWishlist)
    }
  },

  async addItem({ commit, rootGetters }, payload) {
    const user = rootGetters['auth/user']
    let productId

    // Handle both cases: payload can be a productId (number) or a product object
    if (typeof payload === 'number') {
      productId = payload
    } else if (payload && payload.id) {
      productId = payload.id
    } else if (payload && payload.productID) {
      productId = payload.productID
    } else {
      console.error('Invalid payload for addItem:', payload)
      return
    }

    if (user && user.userId) {
      // Authenticated user: add to backend
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        await wishlistService.addWishlistItem(user.userId, productId)
        commit('ADD_ITEM', productId)
      } catch (error) {
        commit('SET_ERROR', error.message)
        console.error('Failed to add to wishlist:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    } else {
      // Guest user: add to sessionStorage
      commit('ADD_ITEM', productId)
      const guestWishlist = JSON.parse(sessionStorage.getItem('guestWishlist') || '[]')
      if (!guestWishlist.includes(productId)) {
        guestWishlist.push(productId)
        sessionStorage.setItem('guestWishlist', JSON.stringify(guestWishlist))
      }
    }
  },

  async removeItem({ commit, rootGetters }, payload) {
    const user = rootGetters['auth/user']
    let productId

    // Handle both cases: payload can be a productId (number) or a product object
    if (typeof payload === 'number') {
      productId = payload
    } else if (payload && payload.id) {
      productId = payload.id
    } else if (payload && payload.productID) {
      productId = payload.productID
    } else {
      console.error('Invalid payload for removeItem:', payload)
      return
    }

    if (user && user.userId) {
      // Authenticated user: remove from backend
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        await wishlistService.removeWishlistItem(user.userId, productId)
        commit('REMOVE_ITEM', productId)
      } catch (error) {
        commit('SET_ERROR', error.message)
        console.error('Failed to remove from wishlist:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    } else {
      // Guest user: remove from sessionStorage
      commit('REMOVE_ITEM', productId)
      const guestWishlist = JSON.parse(sessionStorage.getItem('guestWishlist') || '[]')
      const updatedWishlist = guestWishlist.filter(id => id !== productId)
      sessionStorage.setItem('guestWishlist', JSON.stringify(updatedWishlist))
    }
  },

  clearWishlist({ commit, rootGetters }) {
    const user = rootGetters['auth/user']
    commit('CLEAR_WISHLIST')
    if (!user || !user.userId) {
      sessionStorage.removeItem('guestWishlist')
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

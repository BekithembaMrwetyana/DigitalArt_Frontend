import {
  getCartItemsByUserId,
  saveCartItem,
  updateCartItem,
  deleteCartItem,
} from '@/services/CartItemService'

const state = () => ({
  items: [],           // array of cart items
  loading: false,
  error: null,
})

const getters = {
  cartItems: (s) => s.items,
  cartCount: (s) => s.items.reduce((sum, it) => sum + (it.quantity || 0), 0),
  cartSubtotal: (s) =>
    s.items.reduce((sum, it) => {
      const qty = it.quantity || 0
      const price = it.price ?? it.product?.price ?? 0
      return sum + qty * price
    }, 0),
}

const mutations = {
  SET_LOADING(state, val) { state.loading = val },
  SET_ERROR(state, err) { state.error = err },
  SET_ITEMS(state, items) { state.items = items },
  ADD_ITEM(state, item) { state.items.push(item) },
  UPDATE_ITEM(state, updated) {
    const idx = state.items.findIndex(i => (i.id ?? i.cartItem_id) === (updated.id ?? updated.cartItem_id))
    if (idx !== -1) state.items.splice(idx, 1, updated)
  },
  REMOVE_ITEM(state, id) {
    state.items = state.items.filter(i => (i.id ?? i.cartItem_id) !== id)
  },
  CLEAR(state) { state.items = [] },
}

const actions = {
  async fetchUserCart({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const userRaw = localStorage.getItem('user')
      if (!userRaw) { commit('SET_ITEMS', []); return }
      const user = JSON.parse(userRaw)
      const list = await getCartItemsByUserId(user.userId ?? user.id)

      // Normalize shape just in case
      const normalized = list.map(it => ({
        ...it,
        product: it.product || {},
        productName: it.product?.productName || it.product?.title || 'Unnamed Product',
        price: it.price ?? it.product?.price ?? 0,
        quantity: it.quantity ?? 1,
      }))

      commit('SET_ITEMS', normalized)
    } catch (e) {
      commit('SET_ERROR', 'Failed to load cart')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async addToCart({ dispatch }, { product, quantity = 1 }) {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user?.userId && !user?.id) throw new Error('Not logged in')

    const payload = {
      product,                 
      quantity,
      user,                    
      price: product.price,   
    }
    await saveCartItem(payload)
    await dispatch('fetchUserCart')
  },

  async updateItemQuantity({ dispatch }, { item, quantity }) {
    const payload = { ...item, quantity }
    await updateCartItem(payload)
    await dispatch('fetchUserCart')
  },

  async removeItem({ dispatch }, itemId) {
    await deleteCartItem(itemId)
    await dispatch('fetchUserCart')
  },

  async clearCart({ commit }) {
    commit('CLEAR')
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

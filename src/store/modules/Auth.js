import userService from "@/services/UserService.js"
 
const userFromStorage = JSON.parse(localStorage.getItem("user"))

export default {
  namespaced: true,
  state: {
    user: userFromStorage || null
  },
  getters: {
    isAuthenticated: state => !!state.user,
    user: state => state.user
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
      } else {
        localStorage.removeItem("user")
      }
    }
  },
  actions: {
    async login({ commit, dispatch }, { email, password, role }) {
      try {
        const user = await userService.loginUser(email, password, role)
        if (user && user.userId) {
          commit("SET_USER", user)
          // Refetch wishlist when user logs in
          dispatch('wishlist/fetchWishlist', null, { root: true })
          return user
        } else {
          commit("SET_USER", null)
          return null
        }
      } catch (err) {
        commit("SET_USER", null)
        return null
      }
    },
    logout({ commit, dispatch }) {
      commit("SET_USER", null)
      // Clear wishlist when user logs out
      dispatch('wishlist/clearWishlist', null, { root: true })
    }
  }
}


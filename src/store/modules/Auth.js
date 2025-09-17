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
    async login({ commit }, { email, password, role }) {
      try {
        const user = await userService.loginUser(email, password, role)
        if (user && user.userId) {
          commit("SET_USER", user)
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
    logout({ commit }) {
      commit("SET_USER", null)
    }
  }
}


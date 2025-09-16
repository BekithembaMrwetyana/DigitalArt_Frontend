// // store/modules/auth.js
// import { authService } from '@/services/authService'

// export default {
//   namespaced: true,
//   state: () => ({
//     user: JSON.parse(localStorage.getItem('user')) || null,
//     token: null
//   }),
//   getters: {
//     isAuthenticated: state => !!state.user,
//     user: state => state.user,
//     token: state => state.token
//   },
//   mutations: {
//     SET_USER(state, user) {
//       state.user = user
//       localStorage.setItem('user', JSON.stringify(user))
//     },
//     LOGOUT(state) {
//       state.user = null
//       state.token = null
//       localStorage.removeItem('user')
//     }
//   },
//   actions: {
//     async login({ commit }, credentials) {
//       const response = await authService.login(credentials)
//       commit('SET_USER', response.data)
//     },
//     async register({ commit }, userData) {
//       const response = await authService.register(userData)
//       commit('SET_USER', response.data)
//     },
//     logout({ commit }) {
//       commit('LOGOUT')
//     }
//   }
// }

// export default {
//   namespaced: true,
//   state: {
//     user: JSON.parse(localStorage.getItem("user")) || null
//   },
//   getters: {
//     isAuthenticated: state => !!state.user,
//     user: state => state.user
//   },
//   mutations: {
//     SET_USER(state, user) {
//       state.user = user;
//     },
//     LOGOUT(state) {
//       state.user = null;
//     }
//   },
//   actions: {
//     loginSuccess({ commit }, user) {
//       commit("SET_USER", user);
//     },
//     logout({ commit }) {
//       commit("LOGOUT");
//       localStorage.removeItem("user");
//     }
//   }
// };
export default {
  namespaced: true,
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null
  }),
  getters: {
    isAuthenticated: state => !!state.user,
    user: state => state.user
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    LOGOUT(state) {
      state.user = null;
    }
  },
  actions: {
    loginSuccess({ commit }, user) {
      commit("SET_USER", user);
      localStorage.setItem("user", JSON.stringify(user)); // persist
    },
    logout({ commit }) {
      commit("LOGOUT");
      localStorage.removeItem("user");
    }
  }
}



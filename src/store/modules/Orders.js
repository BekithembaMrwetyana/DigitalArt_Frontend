import OrderService from "@/services/OrderService";

const state = () => ({
  orders: [],
  loading: false,
  error: null
});

const mutations = {
  SET_LOADING(state, val) { state.loading = val },
  SET_ERROR(state, err) { state.error = err },
  SET_ORDERS(state, orders) { state.orders = orders }
};

const actions = {
  async fetchAllOrders({ commit }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    try {
      const data = await OrderService.getAllOrders();
      commit("SET_ORDERS", data);
    } catch (err) {
      commit("SET_ERROR", "Failed to load orders");
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchUserOrders({ commit }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.userId) throw new Error("Not logged in");
      const data = await OrderService.getOrdersByUserId(user.userId);
      commit("SET_ORDERS", data);
    } catch (err) {
      commit("SET_ERROR", "Failed to load user orders");
    } finally {
      commit("SET_LOADING", false);
    }
  }
};

const getters = {
  orders: state => state.orders,
  loading: state => state.loading,
  error: state => state.error
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

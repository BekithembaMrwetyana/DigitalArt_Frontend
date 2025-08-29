import { createPayment } from "@/services/PaymentService";

const state = () => ({
  payments: [],
  loading: false,
  error: null,
});

const getters = {
  allPayments: (s) => s.payments,
};

const mutations = {
  SET_LOADING(state, val) { state.loading = val; },
  SET_ERROR(state, err) { state.error = err; },
  ADD_PAYMENT(state, payment) { state.payments.push(payment); },
};

const actions = {
  async createPayment({ commit }, paymentData) {
    try {
      commit("SET_LOADING", true);
      const saved = await createPayment(paymentData);
      commit("ADD_PAYMENT", saved);
      return saved;
    } catch (err) {
      commit("SET_ERROR", "Failed to create payment");
      throw err;
    } finally {
      commit("SET_LOADING", false);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

import {
  createPayment,
  getPaymentById,
  updatePayment,
  deletePayment,
  getAllPayments,
} from "@/services/PaymentService";

const state = () => ({
  payments: [],
  loading: false,
  error: null,
});

const getters = {
  allPayments: (state) => state.payments,
  paymentById: (state) => (id) => state.payments.find((p) => p.paymentID === id),
  isLoading: (state) => state.loading,
  error: (state) => state.error,
};

const mutations = {
  SET_LOADING(state, val) {
    state.loading = val;
  },
  SET_ERROR(state, err) {
    state.error = err;
  },
  SET_PAYMENTS(state, payments) {
    state.payments = payments;
  },
  ADD_PAYMENT(state, payment) {
    state.payments.push(payment);
  },
  UPDATE_PAYMENT(state, updatedPayment) {
    const index = state.payments.findIndex((p) => p.paymentID === updatedPayment.paymentID);
    if (index !== -1) {
      state.payments.splice(index, 1, updatedPayment);
    }
  },
  DELETE_PAYMENT(state, paymentID) {
    state.payments = state.payments.filter((p) => p.paymentID !== paymentID);
  },
};

const actions = {
  async fetchAllPayments({ commit }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    try {
      const payments = await getAllPayments();
      commit("SET_PAYMENTS", payments);
    } catch (err) {
      commit("SET_ERROR", err.response?.data?.message || err.message);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async createPayment({ commit }, paymentData) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    try {
      const saved = await createPayment(paymentData);
      commit("ADD_PAYMENT", saved);
      return saved;
    } catch (err) {
      commit("SET_ERROR", err.response?.data?.message || err.message);
      throw err;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async updatePayment({ commit }, { paymentID, paymentData }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    try {
      const updated = await updatePayment(paymentID, paymentData);
      commit("UPDATE_PAYMENT", updated);
      return updated;
    } catch (err) {
      commit("SET_ERROR", err.response?.data?.message || err.message);
      throw err;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async deletePayment({ commit }, paymentID) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    try {
      await deletePayment(paymentID);
      commit("DELETE_PAYMENT", paymentID);
    } catch (err) {
      commit("SET_ERROR", err.response?.data?.message || err.message);
      throw err;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchPaymentById({ commit }, paymentID) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    try {
      const payment = await getPaymentById(paymentID);
      return payment;
    } catch (err) {
      commit("SET_ERROR", err.response?.data?.message || err.message);
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

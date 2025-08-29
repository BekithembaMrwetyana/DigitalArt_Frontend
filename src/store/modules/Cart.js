import { getCartItemsByUserId, saveCartItem, updateCartItem, deleteCartItem } from "@/services/CartItemService";

const state = () => ({
  items: [],
  loading: false,
  error: null,
});

const getters = {
  cartItems: (s) => s.items,
  cartCount: (s) => s.items.reduce((sum, it) => sum + (it.quantity || 0), 0),
  cartSubtotal: (s) =>
    s.items.reduce((sum, it) => {
      const qty = it.quantity || 0;
      const price = it.price ?? it.product?.price ?? 0;
      return sum + qty * price;
    }, 0),
};

const mutations = {
  SET_LOADING(state, val) { state.loading = val },
  SET_ERROR(state, err) { state.error = err },
  SET_ITEMS(state, items) { state.items = items },
  CLEAR(state) { state.items = [] },
};

const actions = {
  async fetchUserCart({ commit }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    try {
      const userRaw = localStorage.getItem("user");
      if (!userRaw) { commit("SET_ITEMS", []); return; }
      const user = JSON.parse(userRaw);
      const list = await getCartItemsByUserId(user.userId ?? user.id);
      const normalized = list.map(it => ({
        ...it,
        product: it.product || {},
        productName: it.product?.productName || it.product?.title || "Unnamed Product",
        price: it.price ?? it.product?.price ?? 0,
        quantity: it.quantity ?? 1,
      }));
      commit("SET_ITEMS", normalized);
    } catch (error) {
      commit("SET_ERROR", "Failed to load cart");
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async addToCart({ dispatch }, { product, quantity = 1 }) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.userId && !user?.id) throw new Error("Not logged in");
    await saveCartItem({ product, quantity, user, price: product.price });
    dispatch("fetchUserCart");
  },

  async updateItemQuantity({ dispatch }, { item, quantity }) {
    await updateCartItem({ ...item, quantity });
    dispatch("fetchUserCart");
  },

  async removeItem({ dispatch }, itemId) {
    await deleteCartItem(itemId);
    dispatch("fetchUserCart");
  },

  clearCart({ commit }) {
    commit("CLEAR");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

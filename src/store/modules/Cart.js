import { saveCartItem, deleteCartItem, getCartItemsByUserId } from "@/services/CartItemService";

const state = () => ({
  cartItems: [],
  loading: false,
  error: null,
});

const getters = {
  cartItems: (s) => s.cartItems,
  cartCount: (s) => s.cartItems.length,
  cartSubtotal: (s) =>
    s.cartItems.reduce((sum, it) => sum + (it.price ?? 0), 0),
};

const mutations = {
  SET_LOADING(state, val) { state.loading = val; },
  SET_ERROR(state, err) { state.error = err; },
  SET_ITEMS(state, items) { state.cartItems = items; },
  CLEAR(state) { state.cartItems = []; },
};

const actions = {
  async fetchUserCart({ commit }) {
    commit("SET_LOADING", true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.userId) return commit("SET_ITEMS", []);

      const list = await getCartItemsByUserId(user.userId);

      // Use full product object from backend
      const normalized = list.map(it => ({
        cartItemID: it.cartItemID,
        quantity: it.quantity,
        price: it.price,
        product: it.product
      }));

      commit("SET_ITEMS", normalized);
    } catch (err) {
      console.error("Cart fetch error:", err);
      commit("SET_ITEMS", []);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async addToCart({ dispatch }, { product }) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.userId) throw new Error("Not logged in");

  const payload = {
  userId: user.userId,
  productId: product.productID ?? product.id,
  quantity: 1,
  price: product.price // make sure your product object has a price field
};

    await saveCartItem(payload);
    await dispatch("fetchUserCart");
  },

  async removeItem({ dispatch }, cartItemID) {
    if (!cartItemID) throw new Error("Missing cartItemID");
    await deleteCartItem(cartItemID);
    await dispatch("fetchUserCart");
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

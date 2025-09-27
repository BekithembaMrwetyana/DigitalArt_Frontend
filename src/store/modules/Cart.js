import { saveCartItem, updateCartItem, deleteCartItem, getCartItemsByUserId } from "@/services/CartItemService";

const state = () => ({
  cartItems: [],
  loading: false,
  error: null,
});

const getters = {
  cartItems: (s) => s.cartItems,
  cartCount: (s) => s.cartItems.length, // unique items only
  cartSubtotal: (s) =>
    s.cartItems.reduce((sum, it) => sum + (it.price ?? it.product?.price ?? 0), 0),
};
const mutations = {
  SET_LOADING(state, val) { state.loading = val },
  SET_ERROR(state, err) { state.error = err },
  SET_ITEMS(state, items) { state.cartItems = items },
  CLEAR(state) { state.cartItems = [] },
};


const actions = {
  async fetchUserCart({ commit }) {
    commit("SET_LOADING", true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.userId) return commit("SET_ITEMS", []);

      const list = await getCartItemsByUserId(user.userId);

      const normalized = list.map(it => ({
        cartItemID: it.cartItemID,
        price: it.price ?? it.product?.price ?? 0,
        product: {
          productID: it.product?.productID ?? it.product?.id,
          title: it.product?.title,
          imageUrl: it.product?.imageUrl,
        },
      }));


      commit("SET_ITEMS", normalized);
    } catch (err) {
      console.error("Cart fetch error:", err);
      commit("SET_ITEMS", []);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async addToCart({ state, dispatch }, { product }) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.userId) throw new Error("Not logged in");

    const exists = state.cartItems.some(
      it => it.product?.productID === (product.productID ?? product.id)
    );
    if (exists) {
      alert("This product is already in your cart.");
      return;
    }

    const payload = {
      user: { userId: user.userId },
      product: { productID: product.productID ?? product.id },
      price: product.price ?? 0,
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

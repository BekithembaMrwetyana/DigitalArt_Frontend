import { saveCartItem, updateCartItem, deleteCartItem, getCartItemsByUserId } from "@/services/CartItemService";

const state = () => ({
  cartItems: [],
  loading: false,
  error: null,
});

const getters = {
  cartItems: (s) => s.cartItems,
  cartCount: (s) => s.cartItems.reduce((sum, it) => sum + (it.quantity || 0), 0),
  cartSubtotal: (s) =>
    s.cartItems.reduce((sum, it) => {
      const qty = it.quantity || 0;
      const price = it.price ?? it.product?.price ?? 0;
      return sum + qty * price;
    }, 0),
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
    commit("SET_ERROR", null);

    try {
      const userRaw = localStorage.getItem("user");
      if (!userRaw) {
        commit("SET_ITEMS", []);
        return;
      }

      const user = JSON.parse(userRaw);
      const userId = user?.userId || user?.id;   

      const list = await getCartItemsByUserId(userId);

      console.log("Raw cart items from backend:", list);

      const normalized = list.map(it => ({
        cartItemID: it.cartItemID,
        quantity: it.quantity ?? 1,
        price: it.price ?? it.product?.price ?? 0,
        product: {
          productID: it.product?.productID ?? it.product?.id,
          title: it.title || "Unnamed Product",
        },

      }));

      commit("SET_ITEMS", normalized);
    } catch (error) {
      console.error("Error fetching cart:", error);
      commit("SET_ERROR", "Failed to load cart");
      commit("SET_ITEMS", []);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async addToCart({ dispatch }, { product, quantity = 1 }) {
    const raw = localStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : {};
    const userId = user?.userId || user?.id; 

    if (!userId) throw new Error("Not logged in");

    const price =
      product.price ??
      product.productPrice ??
      product.cost ??
      0;

    const payload = {
      user: { userId },
      product: { productID: product.productID ?? product.id },
      quantity,
      price,
    };

    console.log("Sending payload to backend:", payload);

    await saveCartItem(payload);
    await dispatch("fetchUserCart");
  },

  async updateItemQuantity({ commit, state, dispatch }, { item, quantity }) {
      if (!item.cartItemID) throw new Error("Missing cartItemID");

      const updatedItems = state.cartItems.map(it =>
        it.cartItemID === item.cartItemID
          ? { ...it, quantity }
          : it
      );
      commit("SET_ITEMS", updatedItems);

      await updateCartItem({
        cartItemID: item.cartItemID,
        quantity,
        price: item.price,
      });

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

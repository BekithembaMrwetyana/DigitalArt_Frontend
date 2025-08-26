import axios from "axios";

const BASE_URL = "http://localhost:8080/api";


export default {
  getCartItems(userId) {
    return axios.get(`${BASE_URL}/cart-items/user/${userId}`);
  },

  addCartItem(cartItem) {
    return axios.post(`${BASE_URL}/cart-items`, cartItem);
  },

  deleteCartItem(id) {
    return axios.delete(`${BASE_URL}/cart-items/${id}`);
  }
};
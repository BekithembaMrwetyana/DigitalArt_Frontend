import api from "@/services/api.js";

const BASE_URL = "/digital_artDB/cart_item";

// ✅ Get all cart items
export const getAllCartItems = async () => {
  try {
    const response = await api.get(`${BASE_URL}/getAll`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

// ✅ Save a new cart item
export const saveCartItem = async (cartItem) => {
  try {
    console.log("Sending cart item payload:", cartItem);
    const response = await api.post(`${BASE_URL}/create`, cartItem, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    console.error("Error saving cartItem:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Get cart items by user
export const getCartItemsByUserId = async (userId) => {
  try {
    const response = await api.get(`${BASE_URL}/findByUser/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user's cart items:", error);
    throw error;
  }
};

// ✅ Update cart item
export const updateCartItem = async (cartItem) => {
  try {
    const response = await api.put(`${BASE_URL}/update`, cartItem);
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

// ✅ Delete cart item
export const deleteCartItem = async (id) => {
  try {
    await api.delete(`${BASE_URL}/delete/${id}`);
  } catch (error) {
    console.error(`Error deleting cart item with ID ${id}:`, error);
    throw error;
  }
};

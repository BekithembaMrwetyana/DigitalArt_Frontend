import axios from "axios";

const BASE_URL = "http://localhost:8080/digital_artDB/cart_item";

// Get all cart items
export const getAllCartItems = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${BASE_URL}/getAll`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

// Save a new cart item
export const saveCartItem = async (cartItem) => {
  const token = localStorage.getItem('token');
  try {
    console.log(" Sending cart item payload:", cartItem); 
    const response = await axios.post(`${BASE_URL}/create`, cartItem, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(" Error saving cartItem:", error.response?.data || error.message);
    throw error;
  }
};


// Get cart items by user
export const getCartItemsByUserId = async (userId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${BASE_URL}/findByUser/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user's cart items:", error);
    throw error;
  }
};

// Update cart item
export const updateCartItem = async (cartItem) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(`${BASE_URL}/update`, cartItem, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

// Delete cart item
export const deleteCartItem = async (id) => {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`${BASE_URL}/delete/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  } catch (error) {
    console.error(`Error deleting cart item with ID ${id}:`, error);
    throw error;
  }
};


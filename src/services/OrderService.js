import axios from "axios";

const BASE_URL = "http://localhost:8080/digital_artDB/api/orders";

// ✅ Helper to get Authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
  // Get all orders (Admin)
  getAllOrders() {
    return axios
      .get(`${BASE_URL}/getAll`, { headers: getAuthHeader() })
      .then(res => res.data);
  },

  // Get orders for a specific user (Customer)
  getOrdersByUserId(userId) {
    return axios
      .get(`${BASE_URL}/user/${userId}`, { headers: getAuthHeader() })
      .then(res => res.data);
  },

  // Update only the status (Admin)
  updateOrder(orderId, paymentStatus) {
    return axios
      .put(`${BASE_URL}/updateStatus/${orderId}`, { paymentStatus }, { headers: getAuthHeader() })
      .then(res => res.data)
      .catch(err => {
        console.error("Error updating order:", err);
        throw err;
      });
  },

  // Delete an order (Admin)
  deleteOrder(orderId) {
    return axios
      .delete(`${BASE_URL}/delete/${orderId}`, { headers: getAuthHeader() })
      .then(res => res.data);
  },

  // Create a new order (Customer)
  createOrder(orderDTO) {
    return axios
      .post(`${BASE_URL}/create`, orderDTO, { headers: getAuthHeader() })
      .then(res => res.data);
  }
};

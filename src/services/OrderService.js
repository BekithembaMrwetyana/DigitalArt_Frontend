import axios from "axios";


const BASE_URL =  "http://localhost:8080/digital_artDB/api/orders";


export default {
  // Get all orders (Admin)
  getAllOrders() {
    return axios.get(`${BASE_URL}/getAll`).then(res => res.data);
  },

  // Get orders for a specific user (Customer)
  getOrdersByUserId(userId) {
    return axios.get(`${BASE_URL}/user/${userId}`).then(res => res.data);
  },

  // Update an order (Admin)
  updateOrder(orderId, orderData) {
  const payload = {
    paymentStatus: orderData.paymentStatus,
    orderDate: orderData.orderDate,
    cartItems: orderData.cartItems
  };

  return axios.put(`${BASE_URL}/update/${orderId}`, payload)
    .then(res => res.data)
    .catch(err => {
      console.error("Error updating order:", err);
      throw err;
    });
},


  // Delete an order (Admin)
  deleteOrder(orderId) {
    return axios.delete(`${BASE_URL}/delete/${orderId}`).then(res => res.data);
  },

  // Create a new order
  createOrder(orderData) {
    return axios.post(`${BASE_URL}/create`, orderData).then(res => res.data);
  }
};

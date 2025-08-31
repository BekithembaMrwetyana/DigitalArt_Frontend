import axios from "axios";

const BASE_URL = "http://localhost:8080/inventory";

export default {
  getAllInventory() {
    return axios.get(`${BASE_URL}/getAll`).then(res => res.data);
  },

  getInventoryById(id) {
    return axios.get(`${BASE_URL}/read/${id}`).then(res => res.data);
  },

  createInventory(inventoryData) {
    return axios.post(`${BASE_URL}/create`, inventoryData).then(res => res.data);
  },

  updateInventory(id, inventoryData) {
    return axios.put(`${BASE_URL}/update/${id}`, inventoryData).then(res => res.data);
  },

  deleteInventory(id) {
    return axios.delete(`${BASE_URL}/delete/${id}`).then(res => res.data);
  }
};

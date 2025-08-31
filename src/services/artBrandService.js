import axios from "axios";


const BASE_URL = "http://localhost:8080/digital_artDB/api/art_brands";

export default {
  // Get all brands
  getAll() {
    return axios.get(`${BASE_URL}/getAll`);
  },

  // Create a new brand
  create(brand) {
    return axios.post(`${BASE_URL}/create`, brand);
  },

  // Update an existing brand
  update(brand) {
    return axios.put(`${BASE_URL}/update`, brand);
  },

  // Delete a brand by ID
  delete(brandId) {
    return axios.delete(`${BASE_URL}/delete/${brandId}`);
  },
};

import axios from "axios";


const BASE_URL = "http://localhost:8080/digital_artDB/api/art_brands";

export default {
 
  getAll() {
    return axios.get(`${BASE_URL}/getAll`);
  },

  
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

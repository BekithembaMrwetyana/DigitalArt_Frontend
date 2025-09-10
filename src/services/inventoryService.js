import axios from "axios";

const BASE_URL = "http://localhost:8080/inventory";

export default {
  getAll() {
    return axios.get(`${BASE_URL}/getAll`).then(res => res.data);
  },
  create(inventory) {
    return axios.post(`${BASE_URL}/create`, inventory).then(res => res.data);
  },
  update(id, inventory) {
    return axios.put(`${BASE_URL}/update/${id}`, inventory).then(res => res.data);
  },
  delete(id) {
    return axios.delete(`${BASE_URL}/delete/${id}`);
  }
};

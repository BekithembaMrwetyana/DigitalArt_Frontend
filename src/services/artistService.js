import axios from "axios";

const BASE_URL = "http://localhost:8080/digital_artDB/api/artist";


export default {
 
  getAll() {
    return axios.get(`${BASE_URL}/getAll`);
  },

  
  create(artist) {
    return axios.post(`${BASE_URL}/create`, artist);
  },

 
  update(artist) {
    return axios.put(`${BASE_URL}/update`, artist);
  },

  
  delete(artistId) {
    return axios.delete(`${BASE_URL}/delete/${artistId}`);
  },

  
  read(artistId) {
    return axios.get(`${BASE_URL}/read/${artistId}`);
  }
};


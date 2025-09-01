import axios from "axios";

const BASE_URL = "http://localhost:8080/api/users";

// Helper function for consistent error logging
function handleError(action, err) {
  if (err.response) {
    console.error(`❌ ${action} failed. Status: ${err.response.status}`);
    console.error("Backend response:", err.response.data);
  } else if (err.request) {
    console.error(`❌ ${action} failed. No response received:`, err.request);
  } else {
    console.error(`❌ ${action} setup error:`, err.message);
  }
  throw err;
}

export default {
  saveUser(user) {
    return axios.post(`${BASE_URL}/create`, user)
      .then(res => res.data)
      .catch(err => handleError("Saving user", err));
  },

  readUser(id) {
    return axios.get(`${BASE_URL}/read/${id}`)
      .then(res => res.data)
      .catch(err => handleError(`Reading user ${id}`, err));
  },

  getAllUsers() {
    return axios.get(`${BASE_URL}/getAll`)
      .then(res => res.data)
      .catch(err => handleError("Fetching all users", err));
  },

  updateUser(id, userData) {
    return axios.put(`${BASE_URL}/update/${id}`, userData)
      .then(res => res.data)
      .catch(err => handleError(`Updating user ${id}`, err));
  },

  deleteUser(id) {
    return axios.delete(`${BASE_URL}/delete/${id}`)
      .then(res => res.data)
      .catch(err => handleError(`Deleting user ${id}`, err));
  }
};

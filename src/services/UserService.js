import axios from "axios"
 
const BASE_URL = "http://localhost:8080/digital_artDB/users"
 
function handleError(action, err) {
  if (err.response) {
    console.error(`❌ ${action} failed. Status: ${err.response.status}`)
    console.error("Backend response:", err.response.data)
  } else if (err.request) {
    console.error(`❌ ${action} failed. No response received:`, err.request)
  } else {
    console.error(`❌ ${action} setup error:`, err.message)
  }
  throw err
}
 
const userService = {
  saveUser(user) {
    return axios.post(`${BASE_URL}/create`, user)
      .then(res => res.data)
      .catch(err => handleError("Saving user", err))
  },
 
  loginUser(email, password, role) {
    return axios.post(`${BASE_URL}/login`, { email, password, role })
      .then(res => res.data)
      .catch(err => handleError("Login failed", err))
  },
 
  getAllUsers() {
    return axios.get(`${BASE_URL}/getAll`)
      .then(res => res.data)
      .catch(err => handleError("Fetching all users", err))
  },
 
  readUser(id) {
    return axios.get(`${BASE_URL}/read/${id}`)
      .then(res => res.data)
      .catch(err => handleError(`Reading user ${id}`, err))
  },
 
  updateUser(id, userData) {
    return axios.put(`${BASE_URL}/update/${id}`, userData)
      .then(res => res.data)
      .catch(err => handleError(`Updating user ${id}`, err))
  },
 
  deleteUser(id) {
    return axios.delete(`${BASE_URL}/delete/${id}`)
      .then(res => res.data)
      .catch(err => handleError(`Deleting user ${id}`, err))
  }
}
 
export default userService
 
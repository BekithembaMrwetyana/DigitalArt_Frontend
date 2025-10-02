import axios from "axios"

const BASE_URL = "http://localhost:8080/digital_artDB/api/wishlist"

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

const wishlistService = {
  getWishlistByUser(userId) {
    return axios.get(`${BASE_URL}/user/${userId}`)
      .then(res => res.data)
      .catch(err => handleError("Fetching wishlist", err))
  },

  addWishlistItem(userId, productId) {
    return axios.post(`${BASE_URL}/add`, null, { params: { userId, productId } })
      .then(res => res.data)
      .catch(err => handleError("Adding to wishlist", err))
  },

  removeWishlistItem(userId, productId) {
    return axios.delete(`${BASE_URL}/remove`, { params: { userId, productId } })
      .then(res => res.data)
      .catch(err => handleError("Removing from wishlist", err))
  }
}

export default wishlistService

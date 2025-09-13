import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/digital_artDB/api'

export default {
  async getAllProducts() {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`)
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  async updateProduct(productId, updatedData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/update/${productId}`, updatedData)
      return response.data
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  async deleteProduct(productId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${productId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }
}

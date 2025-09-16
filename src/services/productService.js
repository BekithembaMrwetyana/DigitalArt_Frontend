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
      const response = await axios.put(`${API_BASE_URL}/products/${productId}`, updatedData)
      return response.data
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  async deleteProduct(productId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/products/${productId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  },

  async addProduct(productData) {
    try {
      const productPayload = {
        title: productData.title,
        description: productData.description,
        price: productData.price,
        categoryId: productData.categoryId,
        imageUrl: productData.imageUrl || '/placeholder-art.jpg',
        imageData: productData.imageData || '' // Include imageData field
      }
      const response = await axios.post(`${API_BASE_URL}/products`, productPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    }
  }
}

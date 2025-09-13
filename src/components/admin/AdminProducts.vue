<template>
  <div class="products-dashboard">
    <!-- Welcome -->
    <div class="welcome-section">
      <h2>Manage Products</h2>
      <p>View, add, and manage artworks in your gallery.</p>
    </div>



    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3>Quick Actions</h3>
      <div class="actions-grid">
        <div class="action-card" @click="addProduct">
          <i class="fa fa-plus"></i>
          <span>Add Product</span>
        </div>
        <router-link to="/admin/categories" class="action-card">
          <i class="fa fa-list"></i>
          <span>Manage Categories</span>
        </router-link>
       
      </div>
    </div>

    <!-- Products Table -->
    <div class="products-table">
      <h3>All Products</h3>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Product ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price (R)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.productID">
            <td><img :src="product.imageUrl" alt="product.title" class="product-img" /></td>
            <td>{{ product.productID }}</td>
            <td>{{ product.title }}</td>
            <td>{{ product.category.name }}</td>
            <td>{{ product.price }}</td>
            <td>
              <button @click="editProduct(product)">Edit</button>
              <button @click="deleteProduct(product.productID)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Product Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="cancelEdit">
      <div class="modal-content" @click.stop>
        <h3>Edit Product</h3>
        <form @submit.prevent="saveEdit">
          <div class="form-group">
            <label for="title">Title:</label>
            <input id="title" v-model="editForm.title" type="text" required>
          </div>
          <div class="form-group">
            <label for="price">Price:</label>
            <input id="price" v-model="editForm.price" type="number" step="0.01" required>
          </div>
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea id="description" v-model="editForm.description"></textarea>
          </div>
          <div class="form-group">
            <label for="categoryId">Category ID:</label>
            <input id="categoryId" v-model="editForm.categoryId" type="text">
          </div>
          <div class="form-group">
            <label for="artistId">Artist ID:</label>
            <input id="artistId" v-model="editForm.artistId" type="text">
          </div>
          <div class="modal-actions">
            <button type="submit">Save</button>
            <button type="button" @click="cancelEdit">Cancel</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
import productService from '@/services/productService'

export default {
  name: 'ProductsDashboard',
  data() {
    return {
      products: [],
      showEditModal: false,
      editingProduct: null,
      editForm: {
        title: '',
        price: '',
        description: '',
        categoryId: '',
        artistId: ''
      }
    }
  },
  methods: {
    async fetchProducts() {
      try {
        const data = await productService.getAllProducts()
        this.products = data.map(product => ({
          productID: product.productID,
          title: product.title,
          description: product.description,
          price: product.price,
          category: {
            name: product.category?.name || 'Unknown'
          },
          imageUrl: product.imageUrl ? `http://localhost:8080/digital_artDB${product.imageUrl}` : (product.image ? `data:image/jpeg;base64,${product.image}` : '/placeholder-art.jpg'),
          orderItems: product.orderItems || []
        }))
      } catch (err) {
        console.error(err)
      }
    },
    addProduct() {
      alert('Add Product functionality coming soon!')
    },
    editProduct(product) {
      this.editingProduct = product
      this.editForm = {
        title: product.title,
        price: product.price,
        description: product.description || '',
        categoryId: product.category?.categoryID || '',
        artistId: product.artist?.artistID || ''
      }
      this.showEditModal = true
    },
    async saveEdit() {
      try {
        const updatedData = {
          title: this.editForm.title,
          price: parseFloat(this.editForm.price),
          description: this.editForm.description,
          categoryId: this.editForm.categoryId,
          artistId: this.editForm.artistId
        }
        await productService.updateProduct(this.editingProduct.productID, updatedData)
        this.showEditModal = false
        this.fetchProducts() 
        alert('Product updated successfully!')
      } catch (err) {
        console.error(err)
        alert('Error updating product')
      }
    },
    cancelEdit() {
      this.showEditModal = false
      this.editingProduct = null
    },
    async deleteProduct(id) {
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          await productService.deleteProduct(id)
          this.fetchProducts()
        } catch (err) {
          console.error(err)
        }
      }
    }
  },
  mounted() {
    this.fetchProducts()
  }
}
</script>

<style scoped>
.products-dashboard {
  background: white;
  border-radius: 8px;
  padding: 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.stats-grid, .actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  padding: 20px;
}

.stat-card, .action-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
}

.products-table {
  padding: 20px;
}

.products-table table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th, .products-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.product-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.modal-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.modal-actions button[type="submit"] {
  background: #007bff;
  color: white;
}

.modal-actions button[type="button"] {
  background: #6c757d;
  color: white;
}
</style>

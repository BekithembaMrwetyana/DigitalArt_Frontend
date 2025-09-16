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
              <button class="action-btn edit-btn" @click="editProduct(product)" title="Edit">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="action-btn delete-btn" @click="confirmDelete(product)" title="Delete">
                <i class="fas fa-trash"></i> Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Product Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="cancelAdd">
      <div class="modal-content" @click.stop>
        <h3>Add Product</h3>
        <form @submit.prevent="saveAdd">
          <div class="form-group">
            <label for="addTitle">Title:</label>
            <input id="addTitle" v-model="addForm.title" type="text" required>
          </div>
          <div class="form-group">
            <label for="addPrice">Price:</label>
            <input id="addPrice" v-model="addForm.price" type="number" step="0.01" required>
          </div>
          <div class="form-group">
            <label for="addDescription">Description:</label>
            <textarea id="addDescription" v-model="addForm.description"></textarea>
          </div>
          <div class="form-group">
            <label for="addCategory">Category:</label>
            <select id="addCategory" v-model="addForm.categoryId" required>
              <option value="">Select Category</option>
              <option v-for="category in categories" :key="category.categoryID" :value="category.categoryID">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="addImageUrl">Image URL:</label>
            <input id="addImageUrl" v-model="addForm.imageUrl" type="url" placeholder="http://localhost:8080/digital_artDB/images/art2.jpeg" required>
          </div>
          <div class="modal-actions">
            <button type="submit">Add Product</button>
            <button type="button" @click="cancelAdd">Cancel</button>
          </div>
        </form>
      </div>
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
            <label for="categoryId">Category:</label>
            <select id="categoryId" v-model="editForm.categoryId">
              <option value="">Select Category</option>
              <option v-for="category in categories" :key="category.categoryID" :value="category.categoryID">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="imageUrl">Image URL:</label>
            <input id="imageUrl" v-model="editForm.imageUrl" type="url" placeholder="http://localhost:8080/digital_artDB/images/art2.jpeg">
          </div>
          <div class="modal-actions">
            <button type="submit">Save</button>
            <button type="button" @click="cancelEdit">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deletingProduct" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content delete-modal" @click.stop>
        <div class="modal-header">
          <h3>Confirm Delete</h3>
        </div>
        <div class="modal-body">
          <i class="fas fa-exclamation-triangle warning-icon"></i>
          <p>Are you sure you want to delete the product "<strong>{{ deletingProduct.title }}</strong>"?</p>
          <p class="warning-text">This action cannot be undone.</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="cancelDelete" :disabled="submitting">
            Cancel
          </button>
          <button type="button" class="btn btn-danger" @click="handleDeleteProduct" :disabled="submitting">
            <span v-if="submitting" class="loading-spinner small"></span>
            Delete
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import productService from '@/services/productService'
import { getAllCategories } from '@/services/categoryService'

export default {
  name: 'ProductsDashboard',
  data() {
    return {
      products: [],
      showEditModal: false,
      showAddModal: false,
      editingProduct: null,
      addForm: {
        title: '',
        price: '',
        description: '',
        categoryId: '',
        imageUrl: ''
      },
      editForm: {
        title: '',
        price: '',
        description: '',
        categoryId: '',
        imageUrl: ''
      },
      categories: [],
      deletingProduct: null,
      submitting: false
    }
  },
  methods: {
    async fetchProducts() {
      try {
        const data = await productService.getAllProducts()
        // Also fetch categories to map category names
        await this.fetchCategories()

        this.products = data.map(product => {
          // Find category name by ID if category relationship is not populated
          let categoryName = 'Unknown'
          if (product.category?.name) {
            categoryName = product.category.name
          } else if (product.categoryId) {
            const category = this.categories.find(cat => cat.categoryID === product.categoryId)
            categoryName = category ? category.name : 'Unknown'
          }

          return {
            productID: product.productID,
            title: product.title,
            description: product.description,
            price: product.price,
            category: {
              name: categoryName,
              categoryID: product.categoryId || product.category?.categoryID
            },
            imageUrl: product.imageUrl ? `http://localhost:8080/digital_artDB${product.imageUrl}` : (product.image ? `data:image/jpeg;base64,${product.image}` : '/placeholder-art.jpg'),
            orderItems: product.orderItems || []
          }
        })
      } catch (err) {
        console.error(err)
      }
    },
    async fetchCategories() {
      try {
        this.categories = await getAllCategories()
      } catch (err) {
        console.error(err)
      }
    },
    addProduct() {
      this.showAddModal = true
    },
    async saveAdd() {
      try {
        // Convert full URL to relative path for backend
        const imageUrl = this.addForm.imageUrl.replace('http://localhost:8080/digital_artDB', '')
        const formData = {
          title: this.addForm.title,
          description: this.addForm.description,
          price: parseFloat(this.addForm.price),
          categoryId: this.addForm.categoryId,
          imageUrl: imageUrl,
          imageData: '' // Empty string for URL-based images
        }
        await productService.addProduct(formData)
        this.showAddModal = false
        this.addForm = { title: '', price: '', description: '', categoryId: '', imageUrl: '' }
        this.fetchProducts()
        alert('Product added successfully!')
      } catch (err) {
        console.error(err)
        alert('Error adding product')
      }
    },
    cancelAdd() {
      this.showAddModal = false
      this.addForm = { title: '', price: '', description: '', categoryId: '', imageUrl: '' }
    },
    editProduct(product) {
      this.editingProduct = product
      this.editForm = {
        title: product.title,
        price: product.price,
        description: product.description || '',
        categoryId: product.category?.categoryID || '',
        imageUrl: product.imageUrl || ''

      }
      this.showEditModal = true
    },
    async saveEdit() {
      try {
        // Convert full URL to relative path for backend
        const imageUrl = this.editForm.imageUrl.replace('http://localhost:8080/digital_artDB', '')
        const updatedData = {
          title: this.editForm.title,
          price: parseFloat(this.editForm.price),
          description: this.editForm.description,
          categoryId: this.editForm.categoryId,
          imageUrl: imageUrl
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
      this.editForm = { title: '', price: '', description: '', categoryId: '', imageUrl: '' }
    },
    confirmDelete(product) {
      this.deletingProduct = product
      this.submitting = false
    },
    async handleDeleteProduct() {
      if (!this.deletingProduct) return
      this.submitting = true
      try {
        await productService.deleteProduct(this.deletingProduct.productID)
        this.deletingProduct = null
        this.submitting = false
        this.fetchProducts()
      } catch (err) {
        console.error(err)
        this.submitting = false
      }
    },
    cancelDelete() {
      this.deletingProduct = null
      this.submitting = false
    }
  },
  mounted() {
    this.fetchProducts()
    this.fetchCategories()
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
.form-group textarea,
.form-group select {
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


.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  margin: 0 2px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.edit-btn {
  background: #007bff;
  color: white;
}

.edit-btn:hover {
  background: #0056b3;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}


.delete-modal .modal-body {
  padding: 24px;
  text-align: center;
}

.warning-icon {
  font-size: 48px;
  color: #ffc107;
  margin-bottom: 16px;
}

.warning-text {
  color: #856404;
  font-size: 14px;
  margin-top: 8px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.loading-spinner.small {
  width: 14px;
  height: 14px;
  border: 1.5px solid #f3f3f3;
  border-top: 1.5px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<template>
  <div class="products-dashboard">
    <!-- Welcome -->
    <div class="welcome-section">
      <h2>Manage Products</h2>
      <p>View, add, and manage artworks in your gallery.</p>
    </div>

    <!-- Quick Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"><i class="fa fa-images"></i></div>
        <div class="stat-info">
          <h3>{{ stats.totalProducts }}</h3>
          <p>Total Products</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fa fa-list"></i></div>
        <div class="stat-info">
          <h3>{{ stats.categories }}</h3>
          <p>Categories</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fa fa-users"></i></div>
        <div class="stat-info">
          <h3>{{ stats.artists }}</h3>
          <p>Artists</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fa fa-check-circle"></i></div>
        <div class="stat-info">
          <h3>{{ stats.available }}</h3>
          <p>Available</p>
        </div>
      </div>
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
        <router-link to="/admin/artists" class="action-card">
          <i class="fa fa-user"></i>
          <span>Manage Artists</span>
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
            <th>Title</th>
            <th>Category</th>
            <th>Price (R)</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.productID">
            <td><img :src="product.imageUrl" alt="product.title" class="product-img" /></td>
            <td>{{ product.title }}</td>
            <td>{{ product.category.name }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.orderItems && product.orderItems.length ? 'Sold' : 'Available' }}</td>
            <td>
              <button @click="editProduct(product)">Edit</button>
              <button @click="deleteProduct(product.productID)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProductsDashboard',
  data() {
    return {
      stats: {
        totalProducts: 0,
        categories: 0,
        artists: 0,
        available: 0
      },
      products: []
    }
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await axios.get('http://localhost:8080/products/getAll')
        this.products = res.data
        this.stats.totalProducts = res.data.length
        this.stats.available = res.data.filter(p => !p.orderItems || p.orderItems.length === 0).length
      } catch (err) {
        console.error(err)
      }
    },
    addProduct() {
      alert('Add Product functionality coming soon!')
    },
    editProduct(product) {
      alert(`Edit product ${product.title} coming soon!`)
    },
    async deleteProduct(id) {
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          await axios.delete(`http://localhost:8080/products/delete/${id}`)
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
</style>

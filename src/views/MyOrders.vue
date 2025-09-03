<template>
  <div class="myorders">
    <div class="main-container">
      <Sidebar />
      <div class="main-content">
        <h1 class="page-title">My Orders</h1>

        <div v-if="loading" class="no-orders">Loading orders...</div>
        <div v-else-if="orders.length === 0" class="no-orders">
          You have no orders yet.
        </div>

        <div v-else class="orders-grid">
          <div v-for="order in orders" :key="order.orderID" class="order-card">
            <div class="order-header">
              <span>Order #{{ order.orderID }}</span>
              <span class="status" :class="order.paymentStatus.toLowerCase()">
                {{ order.paymentStatus }}
              </span>
            </div>
            <div class="order-details">
              <p>Date: {{ formatDate(order.orderDate) }}</p>
              <p>Total: R{{ order.totalAmount }}</p>
            </div>
          </div>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>
      </div>

      <ProductFilter />
    </div>
    <Modal />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Modal from '@/components/common/Modal.vue'
import ProductFilter from '@/components/product/ProductFilter.vue'
import OrderService from '@/services/OrderService.js'

export default {
  components: {
    Sidebar,
    Modal,
    ProductFilter
  },
  setup() {
    const orders = ref([])
    const loading = ref(true)
    const error = ref(null)

    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString()
    }

    onMounted(async () => {
      loading.value = true
      error.value = null

      try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user || !user.userId) throw new Error("No user logged in")

        const data = await OrderService.getOrdersByUserId(user.userId)
        orders.value = data
      } catch (err) {
        console.error('Error fetching orders:', err)
        error.value = 'Failed to load orders. Please try again later.'
      } finally {
        loading.value = false
      }
    })

    return { orders, loading, error, formatDate }
  }
}
</script>

<style scoped>
.no-orders {
  margin-top: 20px;
  font-size: 1.2em;
  color: #555;
}
.orders-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 20px;
}
.order-card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  width: 250px;
  background-color: #f9f9f9;
}
.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: bold;
}
.status.pending { color: orange; }
.status.shipped { color: blue; }
.status.delivered { color: green; }
.error-message {
  margin-top: 20px;
  color: red;
}
</style>


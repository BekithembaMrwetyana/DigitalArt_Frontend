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
      </div>

      <ArtworkFilter />
    </div>
    <Modal />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Modal from '@/components/common/Modal.vue'
import ArtworkFilter from '@/components/artwork/ArtworkFilter.vue'
import OrderService from '@/services/OrderService.js'

export default {
  components: {
    Sidebar,
    Modal,
    ArtworkFilter
  },
  setup() {
    const orders = ref([])
    const loading = ref(true)

    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString()
    }

    onMounted(async () => {
      try {
        const data = await OrderService.getOrdersByUserId(10)
        orders.value = data
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        loading.value = false
      }
    })

    return { orders, loading, formatDate }
  }
}

</script>

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

            <!-- ✅ Show download links for completed orders -->
            <div
              v-if="order.paymentStatus?.toLowerCase() === 'completed'"
              class="download-section"
            >
              <h4>Downloads</h4>
              <ul>
                <li v-for="(link, index) in order.downloadLinks" :key="index">
                  <a
                    :href="link"
                    target="_blank"
                    download
                    class="download-btn"
                  >
                    Download Artwork {{ index + 1 }}
                  </a>
                </li>
              </ul>
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
import { computed, onMounted } from "vue"
import { useStore } from "vuex"
import Modal from "@/components/common/Modal.vue"
import ProductFilter from "@/components/product/ProductFilter.vue"

export default {
  components: { Modal, ProductFilter },
  setup() {
    const store = useStore()

    const orders = computed(() => store.state.Orders?.orders || [])
    const loading = computed(() => store.state.Orders?.loading || false)
    const error = computed(() => store.state.Orders?.error || null)

    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString()
    }

    onMounted(async () => {
  await store.dispatch("Orders/fetchUserOrders")

  const updatedOrders = store.state.Orders.orders.map((order) => {
    if (order.paymentStatus?.toLowerCase() === "completed") {
      return {
        ...order,
        downloadLinks: order.cartItems.map(
          (item) =>
            `http://localhost:8080/digital_artDB/api/orders/download/${order.orderID}/${item.product.productID}`
        ),
      }
    }
    return order
  })

  store.state.Orders.orders = updatedOrders
})


    // ✅ Return variables so the template can use them
    return { orders, loading, error, formatDate }
  },
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
  width: 280px;
  background-color: #f9f9f9;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}
.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: bold;
}
.status.pending {
  color: orange;
}
.status.completed {
  color: green;
}
.status.cancelled {
  color: red;
}

.download-section {
  margin-top: 10px;
   position: relative;
  z-index: 5;
}
.download-btn {
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  z-index: 10;
}
.download-btn:hover {
  text-decoration: underline;
}
.error-message {
  margin-top: 20px;
  color: red;
}
</style>

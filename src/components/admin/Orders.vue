<template>
  <div class="orders">
    <h1>All Orders (Admin)</h1>

    <div v-if="loading" class="loading">Loading orders...</div>
    <div v-else-if="orders.length === 0" class="no-orders">No orders found.</div>

    <table v-else class="orders-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>User</th>
          <th>Date</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.orderID">
          <td>{{ order.orderID }}</td>
          <td>{{ order.user?.firstName + ' ' + order.user?.lastName || 'Unknown' }}</td>
          <td>{{ formatDate(order.orderDate) }}</td>
          <td>R{{ order.totalAmount }}</td>
          <td>
            <select v-model="order.paymentStatus" @change="updateStatus(order)">
              <option>Pending</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </td>
          <td>
            <button @click="deleteOrder(order.orderID)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script>
import OrderService from '@/services/OrderService'

export default {
  name: 'Orders',
  data() {
    return {
      orders: [],
      loading: true,
      error: null
    }
  },
  methods: {
    async fetchAllOrders() {
      this.loading = true
      this.error = null
      try {
        const data = await OrderService.getAllOrders()
        this.orders = data
      } catch (err) {
        console.error('Error fetching orders:', err)
        this.error = 'Failed to load orders. Please try again later.'
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString()
    },
    async updateStatus(order) {
      try {
        await OrderService.updateOrder(order.orderID, order)
        alert(`Order #${order.orderID} status updated`)
      } catch (error) {
        console.error('Failed to update order:', error)
        this.error = `Failed to update order #${order.orderID}.`
      }
    },
    async deleteOrder(orderID) {
      if (!confirm('Delete this order?')) return
      try {
        await OrderService.deleteOrder(orderID)
        this.orders = this.orders.filter(o => o.orderID !== orderID)
        alert(`Order #${orderID} deleted`)
      } catch (error) {
        console.error('Failed to delete order:', error)
        this.error = `Failed to delete order #${orderID}.`
      }
    }
  },
  mounted() {
    this.fetchAllOrders()
  }
}
</script>

<style scoped>
.loading, .no-orders {
  margin-top: 20px;
  font-size: 1.2em;
  color: #555;
}
.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.orders-table th, .orders-table td {
  border: 1px solid #ddd;
  padding: 8px;
}
.orders-table th {
  background-color: #f2f2f2;
}
.error-message {
  margin-top: 20px;
  color: red;
}
</style>

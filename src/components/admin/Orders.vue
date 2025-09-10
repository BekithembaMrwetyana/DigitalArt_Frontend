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
          <td>{{ order.paymentStatus }}</td>
          <td>
            <button @click="editOrder(order)">Edit</button>
            <button @click="deleteOrder(order.orderID)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="error" class="error-message">{{ error }}</div>

    <!-- Edit Modal -->
    <div v-if="editingOrder" class="modal">
      <h3>Edit Order #{{ editingOrder.orderID }}</h3>
      <label>Status:</label>
      <select v-model="editingOrder.paymentStatus">
        <option>Pending</option>
        <option>Shipped</option>
        <option>Delivered</option>
      </select>
      <br/><br/>
      <button @click="saveEdit">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </div>
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
      error: null,
      editingOrder: null, // for the modal
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
    editOrder(order) {
      this.editingOrder = { ...order } // create a copy for editing
    },
    async saveEdit() {
      try {
        // Send the full order object to the backend
        await OrderService.updateOrder(this.editingOrder.orderID, this.editingOrder)

        // Update local list
        const index = this.orders.findIndex(o => o.orderID === this.editingOrder.orderID)
        if (index !== -1) this.orders[index] = { ...this.editingOrder }

        this.editingOrder = null
        alert('Order updated successfully')
      } catch (err) {
        console.error('Failed to update order:', err)
        alert('Failed to update order')
      }
    },
    cancelEdit() {
      this.editingOrder = null
    },
    async deleteOrder(orderID) {
      if (!confirm('Delete this order?')) return
      try {
        await OrderService.deleteOrder(orderID)
        this.orders = this.orders.filter(o => o.orderID !== orderID)
        alert(`Order #${orderID} deleted`)
      } catch (err) {
        console.error('Failed to delete order:', err)
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
.modal {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 20px;
  border: 2px solid #333;
  z-index: 9999;
}
.modal button {
  margin-right: 10px;
}
</style>

<template>
  <div class="orders">
    <h1>📦 All Orders (Admin)</h1>

    <!-- Filter -->
    <div class="filter-bar">
      <label for="statusFilter">Filter by status:</label>
      <select id="statusFilter" v-model="selectedStatus" @change="filterOrders">
        <option value="all">All</option>
        <option value="PENDING">Pending</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
    </div>

    <div v-if="loading" class="loading">Loading orders...</div>
    <div v-else-if="filteredOrders.length === 0" class="no-orders">No orders found.</div>

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
        <tr v-for="order in filteredOrders" :key="order.orderID">
          <td>#{{ order.orderID }}</td>
          <td>{{ order.user?.userID || order.userID || 'Unknown' }}</td>

          <td>{{ formatDate(order.orderDate) }}</td>
          <td>R{{ order.totalAmount }}</td>
          <td>
            <span class="status" :class="order.paymentStatus.toLowerCase()">
              {{ order.paymentStatus }}
            </span>
          </td>
          <td>
            <button class="btn-edit" @click="editOrder(order)">✏️ Edit</button>
            <button class="btn-delete" @click="deleteOrder(order.orderID)">🗑️ Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="error" class="error-message">{{ error }}</div>

    <!-- Edit Modal -->
    <div v-if="editingOrder" class="modal">
      <div class="modal-content">
        <h3>Edit Order #{{ editingOrder.orderID }}</h3>

        <label>Status:</label>
        <select v-model="editingOrder.paymentStatus">
          <option>Pending</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

        <div class="modal-actions">
          <button class="btn-save" @click="saveEdit">💾 Save</button>
          <button class="btn-cancel" @click="cancelEdit">❌ Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderService from "@/services/OrderService";

export default {
  name: "OrdersAdmin",
  data() {
    return {
      orders: [],
      filteredOrders: [],
      selectedStatus: "all",
      loading: true,
      error: null,
      editingOrder: null,
    };
  },
  methods: {
    async fetchAllOrders() {
      this.loading = true;
      this.error = null;
      try {
        const data = await OrderService.getAllOrders();
        this.orders = data;
        this.filterOrders();
      } catch (err) {
        console.error("Error fetching orders:", err);
        this.error = "Failed to load orders. Please try again later.";
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    filterOrders() {
      if (this.selectedStatus === "all") {
        this.filteredOrders = this.orders;
      } else {
        this.filteredOrders = this.orders.filter(
          (o) => o.paymentStatus === this.selectedStatus
        );
      }
    },
    editOrder(order) {
      this.editingOrder = { ...order };
    },
    async saveEdit() {
  try {
    await OrderService.updateOrder(this.editingOrder.orderID, this.editingOrder.paymentStatus);

    const index = this.orders.findIndex(
      (o) => o.orderID === this.editingOrder.orderID
    );
    if (index !== -1) this.orders[index] = { ...this.editingOrder };

    this.filterOrders();
    this.editingOrder = null;
    alert("✅ Order updated successfully");
  } catch (err) {
    console.error("Failed to update order:", err);
    alert("❌ Failed to update order");
  }
},

    
    cancelEdit() {
      this.editingOrder = null;
    },
    async deleteOrder(orderID) {
      if (!confirm("Are you sure you want to delete this order?")) return;
      try {
        await OrderService.deleteOrder(orderID);
        this.orders = this.orders.filter((o) => o.orderID !== orderID);
        this.filterOrders();
        alert(`🗑️ Order #${orderID} deleted`);
      } catch (err) {
        console.error("Failed to delete order:", err);
        this.error = `Failed to delete order #${orderID}.`;
      }
    },
  },
  mounted() {
    this.fetchAllOrders();
  },
};
</script>

<style scoped>
.loading,
.no-orders {
  margin-top: 20px;
  font-size: 1.2em;
  color: #555;
}

.filter-bar {
  margin-top: 10px;
  margin-bottom: 15px;
}
.filter-bar label {
  margin-right: 10px;
  font-weight: bold;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
.orders-table th,
.orders-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
.orders-table th {
  background-color: #f2f2f2;
}

.status {
  padding: 3px 8px;
  border-radius: 5px;
  font-weight: bold;
}
.status.pending {
  color: #b36b00;
  background: #fff3e0;
}
.status.completed {
  color: #006600;
  background: #e0ffe0;
}
.status.cancelled {
  color: #a71d2a;
  background: #ffe0e0;
}

.btn-edit {
  background: #007bff;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  margin-right: 5px;
  cursor: pointer;
}
.btn-edit:hover {
  background: #0056b3;
}
.btn-delete {
  background: #dc3545;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-delete:hover {
  background: #a71d2a;
}

.error-message {
  margin-top: 20px;
  color: red;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
}
.modal-actions {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
.btn-save {
  background: #28a745;
  color: white;
  padding: 6px 12px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-save:hover {
  background: #1e7e34;
}
.btn-cancel {
  background: #6c757d;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-cancel:hover {
  background: #565e64;
}
</style>

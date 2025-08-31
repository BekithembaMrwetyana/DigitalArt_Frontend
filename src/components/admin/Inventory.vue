<template>
  <div>
    <h2>Inventory Management</h2>

    <!-- Form for creating/updating -->
    <form @submit.prevent="saveInventory">
      <label>Product:</label>
      <select v-model.number="inventory.product.productID" required>
        <option value="" disabled>Select a product</option>
        <option v-for="p in products" :key="p.productID" :value="p.productID">
          {{ p.title }} (ID: {{ p.productID }})
        </option>
      </select>

      <label>Quantity:</label>
      <input type="number" v-model.number="inventory.quantity" min="0" required />

      <button type="submit">{{ isEdit ? 'Update' : 'Create' }}</button>
      <button type="button" @click="resetForm">Cancel</button>
    </form>

    <hr />

    <!-- Inventory Table -->
    <table border="1">
      <thead>
        <tr>
          <th>Inventory ID</th>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in inventoryList" :key="item.inventoryID">
          <td>{{ item.inventoryID }}</td>
          <td>{{ item.product.productID }}</td>
          <td>{{ item.product.title }}</td>
          <td>{{ item.quantity }}</td>
          <td>
            <button @click="editInventory(item)">Edit</button>
            <button @click="deleteInventory(item.inventoryID)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import inventoryService from "@/services/inventoryService";
//import productService from "@/services/productService"; // you need a service to fetch products

export default {
  data() {
    return {
      inventoryList: [],
      products: [],
      inventory: { product: { productID: null }, quantity: null },
      isEdit: false,
      editId: null
    };
  },
  methods: {
    fetchInventory() {
      inventoryService.getAllInventory()
        .then(data => this.inventoryList = data)
        .catch(err => console.error("Error fetching inventory:", err));
    },
    fetchProducts() {
      productService.getAllProducts()
        .then(data => this.products = data)
        .catch(err => console.error("Error fetching products:", err));
    },
    saveInventory() {
      if (!this.inventory.product.productID) {
        alert("Please select a valid product.");
        return;
      }

      if (this.isEdit) {
        inventoryService.updateInventory(this.editId, this.inventory)
          .then(() => {
            this.fetchInventory();
            this.resetForm();
          })
          .catch(err => console.error("Error updating inventory:", err));
      } else {
        inventoryService.createInventory(this.inventory)
          .then(() => {
            this.fetchInventory();
            this.resetForm();
          })
          .catch(err => console.error("Error creating inventory:", err));
      }
    },
    editInventory(item) {
      this.inventory = { ...item, product: { ...item.product } };
      this.isEdit = true;
      this.editId = item.inventoryID;
    },
    deleteInventory(id) {
      inventoryService.deleteInventory(id)
        .then(() => this.fetchInventory())
        .catch(err => console.error("Error deleting inventory:", err));
    },
    resetForm() {
      this.inventory = { product: { productID: null }, quantity: null };
      this.isEdit = false;
      this.editId = null;
    }
  },
  mounted() {
    this.fetchInventory();
    this.fetchProducts();
  }
};
</script>

<style scoped>
/* Optional: simple styling */
form {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-top: 10px;
}
input, select {
  width: 200px;
  padding: 5px;
  margin-top: 5px;
}
button {
  margin-top: 10px;
  margin-right: 10px;
  padding: 5px 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 8px;
  text-align: left;
}
</style>

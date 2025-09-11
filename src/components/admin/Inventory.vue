<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">📦 Inventory Management</h1>

    <!-- Add New Inventory -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4 text-gray-700">Add New Inventory</h2>
      <form @submit.prevent="addInventory" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-600">Product ID</label>
          <input 
            v-model.number="newInventory.productID"
            type="number"
            placeholder="Enter Product ID"
            class="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600">Quantity</label>
          <input 
            v-model.number="newInventory.quantity"
            type="number"
            min="0"
            placeholder="Enter Quantity"
            class="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div class="flex items-end">
          <button 
            type="submit" 
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ➕ Add Inventory
          </button>
        </div>
      </form>
    </div>

    <!-- Inventory Table -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-lg font-semibold mb-4 text-gray-700">Inventory List</h2>
      <table class="w-full border-collapse rounded-lg overflow-hidden">
        <thead>
          <tr class="bg-gray-200 text-left text-gray-700">
            <th class="py-2 px-4">ID</th>
            <th class="py-2 px-4">Product Title</th>
            <th class="py-2 px-4">Quantity</th>
            <th class="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="item in inventoryList" 
            :key="item.inventoryID" 
            class="border-t hover:bg-gray-50"
          >
            <td class="py-2 px-4">{{ item.inventoryID }}</td>
            <td class="py-2 px-4">{{ item.product?.title || 'Unknown Product' }}</td>
            <td class="py-2 px-4">
              <input 
                type="number" 
                v-model.number="item.quantity"
                class="w-20 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </td>
            <td class="py-2 px-4 space-x-2">
              <button 
                @click="updateInventory(item)" 
                class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
              >
                💾 Update
              </button>
              <button 
                @click="deleteInventory(item.inventoryID)" 
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                🗑️ Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import InventoryService from "@/services/inventoryService";

export default {
  name: "Inventory",
  data() {
    return {
      inventoryList: [],
      newInventory: {
        productID: null,
        quantity: 0
      }
    };
  },
  methods: {
    // Load all inventory items from backend
    async loadInventory() {
      try {
        this.inventoryList = await InventoryService.getAll();
      } catch (err) {
        console.error("Failed to load inventories:", err);
      }
    },

    // Add a new inventory item
    async addInventory() {
      try {
        const payload = {
          product: { productID: this.newInventory.productID },
          quantity: this.newInventory.quantity
        };

        await InventoryService.create(payload);

        // Reset form
        this.newInventory = { productID: null, quantity: 0 };

        // Reload inventory list
        this.loadInventory();
      } catch (err) {
        console.error("Failed to add inventory:", err);
      }
    },

    // Update an existing inventory item
    async updateInventory(item) {
      try {
        const payload = {
          product: { productID: item.product?.productID || item.productID },
          quantity: item.quantity
        };

        await InventoryService.update(item.inventoryID, payload);
        this.loadInventory();
      } catch (err) {
        console.error(`Failed to update inventory ID ${item.inventoryID}:`, err);
      }
    },

    // Delete an inventory item
    async deleteInventory(id) {
      if (confirm("Are you sure you want to delete this inventory item?")) {
        try {
          await InventoryService.delete(id);
          this.loadInventory();
        } catch (err) {
          console.error(`Failed to delete inventory ID ${id}:`, err);
        }
      }
    }
  },
  mounted() {
    this.loadInventory();
  }
};
</script>



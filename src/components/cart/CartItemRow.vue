<template>
  <tr>
    <td>{{ item.product.name }}</td>
    <td>{{ item.product.price.toFixed(2) }}</td>

    <td>
      <input
        type="number"
        min="1"
        v-model.number="localQuantity"
        @change="updateQuantity"
        class="w-16 border rounded text-center"
      />
    </td>

    <!-- Total Price for this row -->
    <td>{{ (item.product.price * localQuantity).toFixed(2) }}</td>

    <!-- Remove Button -->
    <td>
      <button @click="removeItem" class="bg-red-500 text-white px-2 py-1 rounded">
        Remove
      </button>
    </td>
  </tr>
</template>

<script>
import cartService from "../services/cartitemservice"; 
import { useCartStore } from "../store/cart";

export default {
  name: "CartItemRow",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localQuantity: this.item.quantity, 
    };
  },
  setup() {
    const cartStore = useCartStore();
    return { cartStore };
  },
  methods: {
    async updateQuantity() {
      try {
        await cartService.updateCartItem(this.item.id, this.localQuantity);
        this.cartStore.updateItemQuantity(this.item.id, this.localQuantity);
      } catch (err) {
        console.error("Error updating cart item:", err);
      }
    },
    async removeItem() {
      try {
        await cartService.removeCartItem(this.item.id);
        this.cartStore.removeItem(this.item.id);
      } catch (err) {
        console.error("Error removing cart item:", err);
      }
    },
  },
};
</script>

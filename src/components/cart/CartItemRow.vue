<template>
  <tr>
    <td>{{ item.product.name }}</td>
    <td>{{ item.product.price.toFixed(2) }}</td>

    <td><s></s>
      <input
        type="number"
        min="1"
        v-model.number="localQuantity"
        @change="updateQuantity"
        class="w-16 border rounded text-center"
      />
    </td>

    <td>{{ (item.product.price * localQuantity).toFixed(2) }}</td>

    <td>
      <button @click="removeItem" class="bg-red-500 text-white px-2 py-1 rounded">
        Remove
      </button>
    </td>
  </tr>
</template>

<script>
import { updateCartItem, deleteCartItem } from "@/services/CartItemService";

export default {
  name: "CartItemRow",
  props: { item: { type: Object, required: true } },
  data() {
    return { localQuantity: this.item.quantity };
  },
  methods: {
    async updateQuantity() {
      try {
        await updateCartItem({ id: this.item.id, quantity: this.localQuantity });
        this.$store.dispatch("Cart/updateItemQuantity", { item: this.item, quantity: this.localQuantity });
      } catch (err) { console.error("Error updating cart item:", err); }
    },
    async removeItem() {
      try {
        await deleteCartItem(this.item.id);
        this.$store.dispatch("Cart/removeItem", this.item.id);
      } catch (err) { console.error("Error removing cart item:", err); }
    },
  },
};
</script>
<!-- 
<template>
  <tr>
    <td>{{ item.product.title }}</td>
    <td>{{ item.price.toFixed(2) }}</td>

    <td>
      <input
        type="number"
        min="1"
        v-model.number="localQuantity"
        @change="updateQuantity"
        class="w-16 border rounded text-center"
      />
    </td>

    <td>{{ (item.price * localQuantity).toFixed(2) }}</td>
 
    <td>
      <button @click="removeItem" class="bg-red-500 text-white px-2 py-1 rounded">
        Remove
      </button>
    </td>
  </tr>
</template>

<script>
export default {
  name: "CartItemRow",
  props: { item: { type: Object, required: true } },
  data() {
    return { localQuantity: this.item.quantity };
  },
  methods: {
    async updateQuantity() {
      try {
        await this.$store.dispatch("Cart/updateItemQuantity", {
          item: this.item,
          quantity: this.localQuantity,
        });
      } catch (err) { console.error("Error updating cart item:", err); }
    },
    async removeItem() {
      try {
        await this.$store.dispatch("Cart/removeItem", this.item.cartItemID);
      } catch (err) { console.error("Error removing cart item:", err); }
    },
  },
};
</script> -->

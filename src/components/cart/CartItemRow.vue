<template>
  <tr class="cart-row">
    <td class="cart-cell">{{ item.product.productName }}</td>
    <td class="cart-cell">{{ item.price.toFixed(2) }}</td>

    <td class="cart-cell">
      <input
        type="number"
        min="1"
        v-model.number="localQuantity"
        @change="updateQuantity"
        class="quantity-input"
      />
    </td>

    <td class="cart-cell">{{ (item.price * localQuantity).toFixed(2) }}</td>

    <td class="cart-cell">
      <button @click="removeItem" class="remove-btn">
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
      this.$store.dispatch("Cart/updateItemQuantity", {
        item: this.item,
        quantity: this.localQuantity,
      });
    },
    async removeItem() {
      this.$store.dispatch("Cart/removeItem", this.item.cartItemID);
    },
  },
};
</script>

<style scoped>
.cart-row {
  border-bottom: 1px solid #ddd;
}

.cart-cell {
  padding: 10px;
  text-align: center;
  vertical-align: middle;
}

.quantity-input {
  width: 60px;
  padding: 5px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.remove-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #c0392b;
}
</style>

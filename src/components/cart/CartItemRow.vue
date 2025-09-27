<template>
  <tr class="cart-row">
    <!-- Preview -->
    <td class="cart-cell">
      <img :src="item.product.imageUrl" alt="art preview" class="thumb" />
    </td>

    <!-- Product Info -->
    <td class="cart-cell">
      <div class="info">
        <h4>{{ item.product.title }}</h4>
        <small class="category">{{ item.product.category || 'Digital Art' }}</small>
      </div>
    </td>

    <!-- Price -->
    <td class="cart-cell">R{{ item.price.toFixed(2) }}</td>

    <!-- Remove -->
    <td class="cart-cell">
      <button @click="removeItem" class="remove-btn">Remove</button>
    </td>
  </tr>
</template>

<script>
export default {
  name: "CartItemRow",
  props: { item: { type: Object, required: true } },
  methods: {
    async removeItem() {
      const id = this.item.cartItemID || this.item.id;
      if (!id) {
        console.error("No cart item ID found:", this.item);
        return;
      }
      await this.$store.dispatch("Cart/removeItem", id);
    }

  },
};
</script>

<style scoped>
.thumb {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}
.info h4 {
  margin: 0;
}
.category {
  color: #777;
  font-size: 0.85rem;
}
.remove-btn {
  background: #e74c3c;
  border: none;
  padding: 6px 12px;
  color: #fff;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
}
</style>

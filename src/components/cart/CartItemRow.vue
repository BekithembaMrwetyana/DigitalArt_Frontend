<template>
  <div class="cart-card">
    <!-- Preview -->
    <div class="cart-card-thumb">
      <img 
        :src="item.product.imageBase64 ? `data:image/jpeg;base64,${item.product.imageBase64}` : '/placeholder-art.jpg'" 
        :alt="item.product.title" 
        class="thumb" 
      />
    </div>

    <!-- Product Info -->
    <div class="cart-card-info">
      <h4>{{ item.product.title }}</h4>
      <small class="category">{{ item.product.category?.name || 'Digital Art' }}</small>
    </div>

    <!-- Price -->
    <div class="cart-card-price">R{{ item.price.toFixed(2) }}</div>

    <!-- Remove -->
    <div class="cart-card-action">
      <button @click="removeItem" class="remove-btn">Remove</button>
    </div>
  </div>
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
.cart-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 12px 16px;
  margin-bottom: 12px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.cart-card-thumb img.thumb {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.cart-card-info {
  flex: 1;
  margin-left: 16px;
}

.cart-card-info h4 {
  margin: 0 0 4px 0;
}

.category {
  color: #777;
  font-size: 0.85rem;
}

.cart-card-price {
  font-weight: bold;
  margin-right: 16px;
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

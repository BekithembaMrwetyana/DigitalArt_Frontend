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
  background: linear-gradient(145deg, #ffffff, #f3f4f6);
  padding: 16px 20px;
  margin-bottom: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cart-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.cart-card-thumb img.thumb {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.cart-card-thumb img.thumb:hover {
  transform: scale(1.05);
}

.cart-card-info {
  flex: 1;
  margin-left: 20px;
}

.cart-card-info h4 {
  margin: 0 0 6px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e3a8a;
}

.category {
  color: #555;
  font-size: 0.85rem;
  font-style: italic;
}

.cart-card-price {
  font-weight: 700;
  font-size: 1rem;
  color: #2563eb;
  margin-right: 20px;
  min-width: 80px;
  text-align: right;
}

.cart-card-action {
  display: flex;
  align-items: center;
}

.remove-btn {
  background: #ef4444;
  border: none;
  padding: 8px 14px;
  color: #fff;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease;
}

.remove-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
  background: #b91c1c;
}

/* Responsive */
@media (max-width: 768px) {
  .cart-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .cart-card-price {
    margin: 10px 0;
    text-align: left;
  }
  .cart-card-action {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>

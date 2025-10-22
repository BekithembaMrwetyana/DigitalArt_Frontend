<template>
  <button
    class="add-btn"
    @click.stop="add"
    :disabled="busy || isInCart"
  >
    <!-- Cart Icon -->
    <svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 48 48" style="margin-right: 0.5rem;">
      <g fill="none">
        <path fill="#3e3e3f" d="M18.763 37.96a1.745 1.745 0 1 0 0-3.49a1.745 1.745 0 0 0 0 3.49m12.219 0a1.745 1.745 0 1 0 0-3.49a1.745 1.745 0 0 0 0 3.49"/>
        <path fill="#e2e4e5" d="M32.727 32.724H18.43l1.003-4.364h-1.542a1 1 0 0 1-.257-.04l-1.396 4.886a.872.872 0 0 0 .78 1.263h15.71a.873.873 0 1 0 0-1.746"/>
        <path fill="#fff" d="M37.778 15.606a.87.87 0 0 0-.687-.335H15.273l-.84-2.836a.87.87 0 0 0-.846-.661h-2.618a.873.873 0 0 0 0 1.745h1.936L17.044 27.7a.87.87 0 0 0 .847.661H33.6a.9.9 0 0 0 .506-.165a.87.87 0 0 0 .34-.496l3.49-11.345a.87.87 0 0 0-.159-.749"/>
      </g>
    </svg>

    <!-- Button Text -->
    {{ busy ? 'Adding...' : (isInCart ? 'In Cart' : 'Add to Cart') }}
  </button>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'AddToCartButton',
  props: { product: { type: Object, required: true } },
  setup(props) {
    const store = useStore();
    const busy = ref(false);

    const isInCart = computed(() =>
      store.getters['Cart/cartItems'].some(
        item => item.product?.productID === (props.product.productID ?? props.product.id)
      )
    );

    const add = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.userId) {
        alert('Please sign in to add items to cart.');
        return;
      }

      if (isInCart.value) {
        alert('This product is already in your cart.');
        return;
      }

      try {
        busy.value = true;
        await store.dispatch('Cart/addToCart', { product: props.product });
      } catch (e) {
        alert('Failed to add to cart.');
        console.error(e);
      } finally {
        busy.value = false;
      }
    };

    return { add, busy, isInCart };
  },
};
</script>

<style scoped>
.add-btn {
  background: rgba(33, 150, 243, 0.9);
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.add-btn svg {
  vertical-align: middle;
  transition: transform 0.3s ease;
}

/* Hover Effect */
.add-btn:hover {
  background: rgba(33, 150, 243, 1);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
}

.add-btn:hover svg {
  transform: scale(1.1) translateX(2px);
}

/* Active Click Effect */
.add-btn:active {
  transform: translateY(1px);
  box-shadow: 0 3px 8px rgba(0,0,0,0.2);
}

/* Disabled State */
.add-btn:disabled {
  background: #aaa;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
</style>

<template>
  <button class="add-btn" @click="add" :disabled="busy">
    {{ busy ? 'Adding...' : 'Add to Cart' }}
  </button>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'AddToCartButton',
  props: { product: { type: Object, required: true } },
  setup(props) {
    const store = useStore()
    const busy = ref(false)

    const add = async () => {
      const user = localStorage.getItem('user')
      if (!user) { alert('Please sign in to add items to cart.'); return }
      try {
        busy.value = true
        await store.dispatch('cart/addToCart', { product: props.product, quantity: 1 })
        alert('Added to cart!')
      } catch (e) {
        alert('Failed to add to cart.')
      } finally {
        busy.value = false
      }
    }

    return { add, busy }
  }
}
</script>

<style scoped>
.add-btn {
  background: #2196F3; color: #fff; border: none; padding: .6rem 1rem;
  border-radius: 8px; cursor: pointer; font-weight: 600;
}
</style>

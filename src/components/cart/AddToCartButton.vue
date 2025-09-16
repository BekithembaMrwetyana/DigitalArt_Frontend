<template>
  <button class="add-btn" @click.stop="add" :disabled="busy">
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
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user || !user.userId) { 
    alert('Please sign in to add items to cart.')
    return 
  }

  try {
    busy.value = true
    await store.dispatch('Cart/addToCart', { product: props.product, quantity: 1 }) // ✅ only send product + quantity
    alert('Added to cart!')
  } catch (e) {
    alert('Failed to add to cart.')
    console.error(e)
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
  display: block;
  margin: 1rem auto 0 auto;
}
</style>

<template>
  <button class="add-btn" @click="add" :disabled="busy">
    <svg xmlns="http://www.w3.org/2000/svg" width="2.2em" height="2.2em" viewBox="0 0 48 48" style="vertical-align: middle; margin-right: 0.0em;"><g fill="none"><path fill="" d="M24 47.996c13.255 0 24-10.745 24-24C48 10.743 37.255-.001 24-.001S0 10.742 0 23.997s10.745 23.999 24 23.999"/><path fill="#3e3e3f" d="M18.763 37.96a1.745 1.745 0 1 0 0-3.49a1.745 1.745 0 0 0 0 3.49m12.219 0a1.745 1.745 0 1 0 0-3.49a1.745 1.745 0 0 0 0 3.49"/><path fill="#e2e4e5" d="M32.727 32.724H18.43l1.003-4.364h-1.542a1 1 0 0 1-.257-.04l-1.396 4.886a.872.872 0 0 0 .78 1.263h15.71a.873.873 0 1 0 0-1.746"/><path fill="#fff" d="M37.778 15.606a.87.87 0 0 0-.687-.335H15.273q-.03.001-.06.006l-.84-2.836a.87.87 0 0 0-.846-.661h-2.618a.873.873 0 0 0 0 1.745h1.936L17.044 27.7a.87.87 0 0 0 .847.661H33.6a.9.9 0 0 0 .506-.165a.87.87 0 0 0 .34-.496l3.49-11.345a.87.87 0 0 0-.159-.749m-5.487 1.41v2.618h-2.618v-2.618zm.872 8.954v-1.972h.62zm0-2.845v-2.618h1.714l-.821 2.618zm-.872 0h-2.618v-2.618h2.618zm-15.528-2.618h1.564v2.618h-.789zm2.437 0h2.618v2.618H19.2zm3.49 0h2.619v2.618H22.69zm3.492 0H28.8v2.618h-2.618zm2.618-3.49v2.617h-2.618v-2.618zm-3.491 0v2.617H22.69v-2.618zm-3.491 0v2.617H19.2v-2.618zm-3.491 0v2.617h-1.823l-.775-2.618zm-.53 6.98h.53v1.791zm1.403 2.619v-2.618h2.618v2.618zm3.49 0v-2.618h2.619v2.618zm3.492 0v-2.618H28.8v2.618zm3.49 0v-2.618h2.619v2.618zm5.48-6.982h-1.989v-2.618h2.81z"/><path fill="#df2c2c" d="M11.781 14.397a1.745 1.745 0 1 0 0-3.49a1.745 1.745 0 0 0 0 3.49"/><path fill="#5b5c5f" d="M18.764 34.47a1.746 1.746 0 0 0-1.746 1.745c0 .503.216.953.557 1.272l2.461-2.46a1.74 1.74 0 0 0-1.273-.558m12.219.001a1.746 1.746 0 0 0-1.746 1.745c0 .503.217.953.558 1.272l2.46-2.46a1.74 1.74 0 0 0-1.272-.558"/></g></svg>
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
        await store.dispatch('Cart/addToCart', { product: props.product, quantity: 1 })
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
  background: #2196F3; color: #fff; border: none; padding: 0.4rem 0.8rem;
  border-radius: 18px; cursor: pointer; font-weight: 600; font-size: 0.9rem;
  display: inline-flex; align-items: center; justify-content: center;
}
</style>

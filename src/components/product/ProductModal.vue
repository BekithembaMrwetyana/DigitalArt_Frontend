<template>
  <Modal :modelValue="isVisible" @update:modelValue="closeModal" size="large" :showCloseButton="true" :showHeader="false">
    <div class="product-modal-content">
      <div class="image-container">
        <img :src="product.image || '/placeholder-art.jpg'" :alt="product.title" />
      </div>
      <div class="details-container">
        <h2>{{ product.title }}</h2>
        <p class="description">{{ product.description }}</p>
        <p class="price">R{{ product.price }}</p>
        <AddToCartButton :product="product" />
      </div>
    </div>
  </Modal>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Modal from '../common/Modal.vue'
import AddToCartButton from '../cart/AddToCartButton.vue'

export default {
  name: 'ProductModal',
  components: {
    Modal,
    AddToCartButton
  },
  setup() {
    const store = useStore()
    const product = computed(() => store.getters['ui/selectedArtwork'])
    const isVisible = computed(() => product.value !== null)

    const closeModal = () => {
      store.dispatch('ui/closeModal')
    }

    return {
      product,
      isVisible,
      closeModal
    }
  }
}
</script>

<style scoped>
.product-modal-content {
  display: flex;
  gap: 2rem;
  padding: 1rem;
}

.image-container {
  flex: 1;
  max-width: 50%;
}

.image-container img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: contain;
}

.details-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.details-container h2 {
  margin: 0 0 1rem 0;
  font-size: 2rem;
  color: #333;
}

.description {
  flex-grow: 1;
  margin-bottom: 1rem;
  color: #555;
  font-size: 1.1rem;
  line-height: 1.4;
}

.price {
  font-weight: bold;
  font-size: 1.5rem;
  color: #2c5aa0;
  margin-bottom: 1rem;
}
</style>

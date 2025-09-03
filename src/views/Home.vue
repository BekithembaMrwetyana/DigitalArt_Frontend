<template>
  <div class="home">
    <div class="main-container">
      <ProductFilter />
      
      <div class="main-content">
        <HeroSlider :slides = "slidesData" />
        <ProductGrid :artworks="products" />

        <!-- My Orders link -->
        <div class="guest-orders">
          <router-link to="/myorders">View My Orders</router-link>
        </div>
      </div>
      
      <Sidebar />
    </div>
    
    <Modal />
  </div>
</template>

<script>
import ProductFilter from '@/components/product/ProductFilter.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import HeroSlider from '@/components/hero/HeroSlider.vue'
import Modal from '@/components/common/Modal.vue'

export default {
  name: 'Home',
  components: {
    ProductFilter,
    ProductGrid,
    HeroSlider,
    Modal
  },
  data() {
    return {
      slidesData: [
        { image: 'slide1.jpg', title: 'Slide 1' },
        { image: 'slide2.jpg', title: 'Slide 2' },
        { image: 'slide3.jpg', title: 'Slide 3' }
      ]
    }
  },
  computed: {
    products() {
      return this.$store.getters['products/allProducts'] || []
    }
  },
  mounted() {
    // Simulate a logged-in user for testing MyOrders page
    const testUser = { userId: 10, firstName: 'Test', lastName: 'User' }
    localStorage.setItem('user', JSON.stringify(testUser))

    // Fetch products from backend
    this.$store.dispatch('products/fetchProducts')
  }
}
</script>

<style scoped>
.home {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

.main-content {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.guest-orders {
  margin: 2rem 0;
  text-align: center;
}

.guest-orders a {
  background-color: #667eea;
  color: white;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  text-decoration: none;
}

.guest-orders a:hover {
  background-color: #764ba2;
}

@media (max-width: 768px) {
  .main-container {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .home {
    padding: 1rem 0;
  }
}
</style>


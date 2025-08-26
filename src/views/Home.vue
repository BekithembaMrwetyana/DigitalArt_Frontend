<template>
  <div class="home">
    <div class="main-container">
      <ArtworkFilter />
      
      <div class="main-content">
        <HeroSlider />
        <ArtworkGrid />
      </div>
      
      <Sidebar />
    </div>
    
    <Modal />
  </div>
</template>

<script>
import ArtworkFilter from '@/components/artwork/ArtworkFilter.vue'
import ArtworkGrid from '@/components/artwork/ArtworkGrid.vue'
import HeroSlider from '@/components/hero/HeroSlider.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Modal from '@/components/common/Modal.vue'

export default {
  name: 'Home',
  components: {
    ArtworkFilter,
    ArtworkGrid,
    HeroSlider,
    Sidebar,
    Modal
  }
}
</script>

<style scoped>
.home {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: calc(100vh - 200px); /* Adjust for header height */
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
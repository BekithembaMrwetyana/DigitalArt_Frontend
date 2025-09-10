<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-text">
        <h1>Explore Our Art Gallery</h1>
        <p>Discover unique contemporary artworks from around the world.</p>
        <router-link to="/shop" class="explore-btn">Explore Art Gallery</router-link>
      </div>

      <div class="hero-slider">
        <HeroSlider :slides="slidesData" />
      </div>
    </div>
  </div>

  
</template>

<script>
import HeroSlider from '@/components/hero/HeroSlider.vue'

export default {
  name: 'Home',
  components: { HeroSlider },
  data() {
    return {
      slidesData: [
        { image: 'http://localhost:8080/digital_artDB/images/art18.jpeg' },
        { image: 'http://localhost:8080/digital_artDB/images/art19.jpeg' },
        { image: 'http://localhost:8080/digital_artDB/images/art21.jpeg' },
        { image: 'http://localhost:8080/digital_artDB/images/art23.jpeg' }
      ]
    }
  }
}
</script>

<style scoped>
.home {
  background: white;
  padding: 4rem 2rem;
}

.hero-section {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-text h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.hero-text p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.explore-btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #f9c846;
  color: black;
  font-weight: bold;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.3s ease;
}

.explore-btn:hover {
  background-color: #e0b43a;
}

.hero-slider {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0);
  width: 100%;
  height: 450px; 
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9; 
}

.hero-slider img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; 
  display: block;
}

</style>

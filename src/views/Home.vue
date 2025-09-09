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

  <div class="guest-orders">
      <router-link to="/myorders">View My Orders</router-link>
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
        { image: 'http://localhost:8080/digital_artDB/images/art15.jpeg' },
        { image: 'http://localhost:8080/digital_artDB/images/art16.jpeg' },
        { image: 'http://localhost:8080/digital_artDB/images/art15.jpeg' },
        { image: 'http://localhost:8080/digital_artDB/images/art14.jpeg' }
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
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 450px; /* fixed height for clarity */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9; /* fallback background */
}

.hero-slider img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* keeps images sharp without cropping */
  display: block;
}
/* Styles for the My Orders link */
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
</style>

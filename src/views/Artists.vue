<template>
  <div class="artists-page">
    <div class="artists-header">
      <h1>Featured Artists</h1>
      <p>Explore the art brands created by our talented artists.</p>
    </div>

    <div class="artists-list" v-if="brands.length > 0">
      <div class="artist-card" v-for="brand in brands" :key="brand.brandId">
        <img :src="brand.imageUrl" :alt="brand.brandName" />
        <h2>{{ brand.brandName }}</h2>
        <p>{{ brand.description }}</p>
      </div>
    </div>

    <div v-else class="no-brands">
      No brands available at the moment.
    </div>
  </div>
</template>

<script>
import artBrandService from "@/services/artBrandService.js";

export default {
  name: "Artists",
  data() {
    return {
      brands: [],
    };
  },
  mounted() {
    this.fetchBrands();
  },
  methods: {
    async fetchBrands() {
      try {
        const response = await artBrandService.getAll();
        this.brands = response.data;
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      }
    },
  },
};
</script>

<style scoped>
.artists-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem;
  color: white;
}

.artists-header {
  max-width: 1200px;
  margin: 0 auto 2rem;
  text-align: center;
}

.artists-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.artists-header p {
  font-size: 1.2rem;
  color: #f0f0f0;
}

.artists-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}


@media (max-width: 1024px) {
  .artists-list {
    grid-template-columns: repeat(2, 1fr); 
  }
}

@media (max-width: 640px) {
  .artists-list {
    grid-template-columns: 1fr; 
  }
}

.artist-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  transition: transform 0.2s;
}

.artist-card:hover {
  transform: translateY(-5px);
}

.artist-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.artist-card h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.artist-card p {
  font-size: 1rem;
  color: #f0f0f0;
}

.no-brands {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
}
</style>

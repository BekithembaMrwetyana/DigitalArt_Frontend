<template>
  <div class="artists-page">
    <div class="artists-header">
      <h1>Meet Our Artists</h1>
      <p>Discover the talented artists behind the amazing artworks.</p>
    </div>

    <!-- Artist List -->
    <div class="artists-list" v-if="artists.length > 0">
      <div class="artist-card" v-for="artist in artists" :key="artist.artistId || artist.id">
        <img :src="artist.imageUrl || placeholderImage" :alt="artist.artistName || 'Artist'" />
        <h2>{{ artist.artistName || 'Unnamed Artist' }}</h2>
        <p>{{ artist.description || 'No description available.' }}</p>
        <p class="creation-date">Created on: {{ formatDate(artist.creationDate) }}</p>
      </div>
    </div>

    <div v-else class="no-artists">
      <p>No artists available yet. Please check back soon!</p>
    </div>
  </div>
</template>

<script>
import artistService from "@/services/artistService.js";

export default {
  name: "Artists",
  data() {
    return {
      artists: [],
      placeholderImage: "https://via.placeholder.com/300x200?text=No+Image",
    };
  },
  mounted() {
    this.fetchArtists();
  },
  methods: {
    async fetchArtists() {
      try {
        const response = await artistService.getAll();
        console.log("Backend response:", response.data); 
        this.artists = response.data;
      } catch (error) {
        console.error("Failed to fetch artists:", error);
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return "Unknown";
      const date = new Date(dateStr);
      return date.toLocaleDateString();
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

.no-artists {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
}
</style>

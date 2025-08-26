<template>
  <div class="artwork-card" @click="$emit('click', artwork)">
    <div class="artwork-image">
      <img :src="artwork.image || '/placeholder-art.jpg'" :alt="artwork.title" />
    </div>
    <div class="artwork-info">
      <h3>{{ artwork.title }}</h3>
      <p class="artist">by {{ artwork.artist }}</p>
      <p class="price">${{ artwork.price }}</p>
      <p class="category">{{ artwork.category }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArtworkCard',
  props: {
    artwork: {
      type: Object,
      required: true
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.artwork-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.artwork-card:hover {
  transform: translateY(-5px);
}

.artwork-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.artwork-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artwork-info {
  padding: 1rem;
}

.artwork-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.artist {
  color: #666;
  margin: 0 0 0.5rem 0;
  font-style: italic;
}

.price {
  font-weight: bold;
  color: #2c5aa0;
  margin: 0 0 0.5rem 0;
}

.category {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
  text-transform: capitalize;
}
</style>
<template>
  <div class="collections">
    <div class="collections-header">
      <h1>Art Collections</h1>
      <p>Curated collections of digital artworks organized by theme and style</p>
    </div>
    
    <div class="collections-grid">
      <div v-for="collection in collections" :key="collection.id" class="collection-card">
        <div class="collection-preview" :style="{background: collection.gradient}">
          <div class="collection-overlay">
            <h3>{{ collection.name }}</h3>
            <p>{{ collection.count }} Artworks</p>
          </div>
        </div>
        <div class="collection-info">
          <h4>{{ collection.name }}</h4>
          <p>{{ collection.description }}</p>
          <div class="collection-meta">
            <span>By {{ collection.curator }}</span>
            <span>R{{ collection.priceRange }}</span>
          </div>
          <button class="explore-btn">Explore Collection</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Collections',
  setup() {
    const collections = ref([
      {
        id: 1,
        name: 'Neon Dreams',
        description: 'A collection of vibrant digital artworks inspired by cyberpunk aesthetics and neon-lit urban landscapes.',
        curator: 'Alex Chen',
        count: 12,
        priceRange: '200-500',
        gradient: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)'
      },
      {
        id: 2,
        name: 'Abstract Emotions',
        description: 'Expressive abstract pieces that capture human emotions through color, form, and digital manipulation.',
        curator: 'Maria Rodriguez',
        count: 8,
        priceRange: '150-400',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      {
        id: 3,
        name: 'Urban Pulse',
        description: 'Photography and digital art capturing the rhythm and energy of modern city life.',
        curator: 'David Kim',
        count: 15,
        priceRange: '100-300',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      },
      {
        id: 4,
        name: 'Digital Nature',
        description: 'Reimagined natural landscapes and organic forms created through digital artistry.',
        curator: 'Sarah Johnson',
        count: 10,
        priceRange: '250-600',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      }
    ])
    
    return { collections }
  }
}
</script>

<style scoped>
.collections {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

.collections-header {
  text-align: center;
  color: white;
  padding: 2rem 0 4rem 0;
}

.collections-header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.collections-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.collection-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.collection-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
}

.collection-preview {
  height: 200px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collection-overlay {
  background: rgba(0,0,0,0.5);
  color: white;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
}

.collection-overlay h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.collection-info {
  padding: 1.5rem;
}

.collection-info h4 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.collection-info p {
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.collection-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

.explore-btn {
  background: #2196F3;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  transition: all 0.3s ease;
}

.explore-btn:hover {
  background: #1976D2;
  transform: translateY(-2px);
}
</style>
<template>
  <div class="exhibitions">
    <div class="exhibitions-header">
      <h1>Digital Exhibitions</h1>
      <p>Experience curated digital art exhibitions from around the world</p>
    </div>
    
    <div class="exhibitions-container">
      <div class="current-exhibitions">
        <h2>Current Exhibitions</h2>
        <div class="exhibitions-grid">
          <div v-for="exhibition in currentExhibitions" :key="exhibition.id" class="exhibition-card">
            <div class="exhibition-image" :style="{background: exhibition.gradient}">
              {{ exhibition.title }}
            </div>
            <div class="exhibition-info">
              <h3>{{ exhibition.title }}</h3>
              <p class="exhibition-dates">{{ exhibition.startDate }} - {{ exhibition.endDate }}</p>
              <p>{{ exhibition.description }}</p>
              <div class="exhibition-stats">
                <span>{{ exhibition.artworks }} Artworks</span>
                <span>{{ exhibition.artists }} Artists</span>
              </div>
              <button class="visit-btn">Visit Exhibition</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="upcoming-exhibitions">
        <h2>Upcoming Exhibitions</h2>
        <div class="upcoming-list">
          <div v-for="exhibition in upcomingExhibitions" :key="exhibition.id" class="upcoming-item">
            <div class="upcoming-date">
              <span class="month">{{ exhibition.month }}</span>
              <span class="day">{{ exhibition.day }}</span>
            </div>
            <div class="upcoming-info">
              <h4>{{ exhibition.title }}</h4>
              <p>{{ exhibition.preview }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Exhibitions',
  setup() {
    const currentExhibitions = ref([
      {
        id: 1,
        title: 'Digital Renaissance',
        startDate: 'Aug 1, 2025',
        endDate: 'Aug 30, 2025',
        description: 'A showcase of contemporary digital artists reimagining classical art through modern technology.',
        artworks: 25,
        artists: 8,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      {
        id: 2,
        title: 'Cyber Landscapes',
        startDate: 'Aug 15, 2025',
        endDate: 'Sep 15, 2025',
        description: 'Exploring futuristic landscapes and digital environments created by emerging artists.',
        artworks: 18,
        artists: 6,
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      }
    ])
    
    const upcomingExhibitions = ref([
      {
        id: 3,
        title: 'Abstract Realities',
        month: 'SEP',
        day: '01',
        preview: 'Abstract digital art exploring the boundaries between reality and imagination.'
      },
      {
        id: 4,
        title: 'Portrait Revolution',
        month: 'SEP',
        day: '15',
        preview: 'Contemporary digital portraits challenging traditional representation.'
      },
      {
        id: 5,
        title: 'Color Theory',
        month: 'OCT',
        day: '01',
        preview: 'An exploration of color in digital art and its psychological impact.'
      }
    ])
    
    return {
      currentExhibitions,
      upcomingExhibitions
    }
  }
}
</script>

<style scoped>
.exhibitions {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

.exhibitions-header {
  text-align: center;
  color: white;
  padding: 2rem 0;
}

.exhibitions-header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.exhibitions-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.current-exhibitions {
  margin-bottom: 4rem;
}

.current-exhibitions h2, .upcoming-exhibitions h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.exhibitions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.exhibition-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.exhibition-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
}

.exhibition-image {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.exhibition-info {
  padding: 2rem;
}

.exhibition-info h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.exhibition-dates {
  color: #2196F3;
  font-weight: bold;
  margin-bottom: 1rem;
}

.exhibition-info p {
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.exhibition-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

.visit-btn {
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

.visit-btn:hover {
  background: #1976D2;
  transform: translateY(-2px);
}

.upcoming-list {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.upcoming-item {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.upcoming-item:last-child {
  border-bottom: none;
}

.upcoming-date {
  text-align: center;
  background: #2196F3;
  color: white;
  border-radius: 10px;
  padding: 1rem;
  min-width: 80px;
}

.upcoming-date .month {
  display: block;
  font-size: 0.8rem;
  font-weight: bold;
}

.upcoming-date .day {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
}

.upcoming-info h4 {
  color: #333;
  margin-bottom: 0.5rem;
}

.upcoming-info p {
  color: #666;
}
</style>
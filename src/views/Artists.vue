<template>
  <div class="artists">
    <div class="artists-header">
      <h1>Featured Artists</h1>
      <p>Meet the talented creators behind our digital art collection</p>
    </div>
    
    <div class="artists-grid">
      <div v-for="artist in artists" :key="artist.id" class="artist-card">
        <div class="artist-avatar" :style="{background: artist.gradient}">
          {{ artist.initials }}
        </div>
        <div class="artist-info">
          <h3>{{ artist.name }}</h3>
          <p class="artist-specialty">{{ artist.specialty }}</p>
          <p class="artist-bio">{{ artist.bio }}</p>
          <div class="artist-stats">
            <span>{{ artist.artworks }} Artworks</span>
            <span>{{ artist.followers }} Followers</span>
          </div>
          <button class="view-profile-btn">View Profile</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Artists',
  setup() {
    const artists = ref([
      {
        id: 1,
        name: 'Abethu Ngxitho',
        specialty: 'Digital Surrealism',
        bio: 'Exploring the intersection of dreams and digital reality through vibrant compositions.',
        artworks: 24,
        followers: 1200,
        initials: 'AC',
        gradient: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)'
      },
      {
        id: 2,
        name: 'Thandolwethu Mseleku',
        specialty: 'Abstract Digital Art',
        bio: 'Creating emotional landscapes through abstract forms and bold color palettes.',
        artworks: 18,
        followers: 890,
        initials: 'MR',
        gradient: 'linear-gradient(45deg, #667eea, #764ba2)'
      },
      {
        id: 3,
        name: 'Beki Him',
        specialty: 'Digital Photography',
        bio: 'Capturing urban life and transforming it through digital manipulation techniques.',
        artworks: 32,
        followers: 1500,
        initials: 'DK',
        gradient: 'linear-gradient(45deg, #f093fb, #f5576c)'
      },
      {
        id: 4,
        name: 'Mbali Johnson',
        specialty: 'Nature Digital Art',
        bio: 'Reimagining nature through a digital lens with vibrant colors and organic forms.',
        artworks: 21,
        followers: 750,
        initials: 'SJ',
        gradient: 'linear-gradient(45deg, #4facfe, #00f2fe)'
      }
    ])
    
    return { artists }
  }
}
</script>

<style scoped>
.artists {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

.artists-header {
  text-align: center;
  color: white;
  padding: 2rem 0 4rem 0;
}

.artists-header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.artists-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.artist-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  text-align: center;
  transition: all 0.3s ease;
}

.artist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
}

.artist-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
}

.artist-info h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.artist-specialty {
  color: #2196F3;
  font-weight: bold;
  margin-bottom: 1rem;
}

.artist-bio {
  color: #666;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.artist-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

.view-profile-btn {
  background: #2196F3;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.view-profile-btn:hover {
  background: #1976D2;
  transform: translateY(-2px);
}
</style>
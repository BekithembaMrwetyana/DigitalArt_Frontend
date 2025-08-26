<template>
  <div class="sidebar">
    <div class="ad-section">
      <h4>🌟 FEATURED ARTIST</h4>
      <div class="ad-content">
        Alex Chen
        <br>Digital Surrealism
      </div>
      <button class="ad-btn">EXPLORE WORKS</button>
    </div>
    
    <div class="ad-section">
      <h4>🎨 COMMISSION ART</h4>
      <div class="ad-content">
        Custom Digital Art
        <br>Starting from $50
      </div>
      <button class="ad-btn">GET QUOTE</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ad-section {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.ad-section h4 {
  color: #2196F3;
  margin-bottom: 1rem;
}

.ad-content {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-bottom: 1rem;
}

.ad-btn {
  background: #2196F3;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.ad-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.4);
}
</style>

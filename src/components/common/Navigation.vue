<template>
  <nav class="nav-bar">
    <div class="nav-content">
      <router-link to="/" class="nav-item" :class="{ active: $route.name === 'Home' }">HOME</router-link>
      <router-link to="/gallery" class="nav-item" :class="{ active: $route.name === 'Gallery' }">GALLERY</router-link>
      <router-link to="/contact" class="nav-item" :class="{ active: $route.name === 'Contact' }">CONTACT US</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navigation'
}
</script>

<style scoped>
.nav-bar {
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(10px);
  padding: 0.8rem 2rem;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 2rem;
}

.nav-item {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-item:hover, .nav-item.active {
  background: #2196F3;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .nav-content {
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>
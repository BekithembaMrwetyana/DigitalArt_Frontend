<template>
  <div class="artists-page">
    <div class="artists-header">
      <h1>Featured Artists</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "Artists",
};
</script>

<style scoped>
.artists-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   min-height: 100vh;
  padding-bottom: 2rem;
  
}

.artists-header {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.artists-header h1 {
  font-size: 2.5rem;
  color:white;
  margin-bottom: 1rem;
}
</style>
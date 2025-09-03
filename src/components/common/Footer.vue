<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- General Section -->
      <div class="footer-section">
        <h3>General</h3>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/about">About Us</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
        </ul>
      </div>

      <!-- Movies Section (adapted for Art Gallery) -->
      <div class="footer-section">
        <h3>Gallery</h3>
        <ul>
          <li><router-link to="/gallery">Now Showing</router-link></li>
          <li><router-link to="/exhibitions">Coming Soon</router-link></li>
          <li><router-link to="/collections">Collections</router-link></li>
        </ul>
      </div>

    </div>

    <!-- Copyright Section -->
    <div class="footer-bottom">
      <p>&copy; 2024 ArtSpace Digital Art Gallery. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
</style>
<template>
  <div id="app">
    <!-- Show Header/Footer only for non-admin routes -->
    <Header v-if="!isAdminRoute" />
    <router-view class="router-view" />

    <Footer v-if="!isAdminRoute" />
  </div>
</template>

<script>
import Footer from '@/components/common/Footer.vue'
import Header from '@/components/common/Header.vue'
import { useStore } from 'vuex'

export default {
  name: 'App',
  components: { Header, Footer },
  setup() {
    const store = useStore()

    // Load cart if user is already logged in
    const userRaw = localStorage.getItem('user')
    if (userRaw) {
      store.dispatch('Cart/fetchUserCart')
    }

    return {}
  },
  computed: {
    isAdminRoute() {
      return this.$route.path.startsWith('/admin')
    }
  }
}
</script>


<style>
/* Global App Styles */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Make sure the router-view takes up available space */
.router-view {
  flex: 1;
}

/* Admin routes should take full height */
.admin-layout {
  min-height: 100vh;
  display: flex;
}

/* Footer Styles - only for non-admin pages */
.footer {
  background: #2d2d2d;
  color: #ccc;
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3rem;
}

.footer-section h3 {
  color: #ff9800;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 0.8rem;
}

.footer-section a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.95rem;
  line-height: 1.4;
}

.footer-section a:hover {
  color: #ff9800;
}

.footer-bottom {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #444;
  color: #999;
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 992px) {
  .footer-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
  
  .footer {
    padding: 2rem 0 1rem;
  }
  
  .footer-section h3 {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  
  .footer-section li {
    margin-bottom: 0.6rem;
  }
}

/* Remove duplicate elements */
.header + .header {
  display: none !important;
}

header + header {
  display: none !important;
}

nav + nav {
  display: none !important;
}
</style>

<template>
  <header class="header">
    <div class="header-container">
      <div class="logo-section">
        <router-link to="/" class="logo-link">
          <h1 class="logo">ArtSpace</h1>
          <p class="tagline">Digital Art Gallery</p>
        </router-link>
      </div>
      
      <div class="search-section">
        <div class="search-container">
          <input 
            type="text" 
            placeholder="Search artworks" 
            class="search-input"
            v-model="searchQuery"
            @keyup.enter="performSearch"
          />
          <button @click="performSearch" class="search-button">
            🔍
          </button>
        </div>
      </div>
      
<div class="auth-section">
  <!-- Guest view -->
  <div v-if="!isAuthenticated" class="auth-buttons">
    <span class="greeting">Hi Guest,</span>
    <button @click="showSignIn" class="auth-btn sign-in-btn">Sign in</button>
    <span class="separator">|</span>
    <button @click="showRegister" class="auth-btn register-btn">Register</button>
    <router-link to="/wishlist" class="wishlist-button" title="View wishlist">
      ❤️<span class="badge" v-if="wishlistCount">{{ wishlistCount }}</span>
    </router-link>
  </div>

  <!-- Logged-in user view -->
  <div v-else class="user-menu">
    <div class="user-info">
      <span class="welcome">
        Hi {{ (user?.firstName || '') + ' ' + (user?.lastName || '') || 'Guest' }},
      </span>


      <!-- Wishlist -->
      <router-link to="/wishlist" class="wishlist-button" title="View wishlist">
        ❤️<span class="badge" v-if="wishlistCount">{{ wishlistCount }}</span>
      </router-link>

      
      <router-link to="/cart" class="cart-button" title="View cart">
        🛒<span class="badge" v-if="cartCount">{{ cartCount }}</span>
      </router-link>

     
   <div class="user-dropdown" @click="toggleUserMenu">
 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M172,120a44,44,0,1,1-44-44A44.05,44.05,0,0,1,172,120Zm60,8A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88.09,88.09,0,0,0-91.47-87.93C77.43,41.89,39.87,81.12,40,128.25a87.65,87.65,0,0,0,22.24,58.16A79.71,79.71,0,0,1,84,165.1a4,4,0,0,1,4.83.32,59.83,59.83,0,0,0,78.28,0,4,4,0,0,1,4.83-.32,79.71,79.71,0,0,1,21.79,21.31A87.62,87.62,0,0,0,216,128Z"></path></svg>
  <span class="dropdown-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg></span>
</div>

    </div>

    <div v-if="showUserMenu" class="dropdown-menu">
      <router-link to="/profile" class="dropdown-item"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="15" fill="#000000" viewBox="0 0 256 256"><path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path></svg>Profile</router-link>
      <router-link to="/myorders" class="dropdown-item"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="15" fill="#000000" viewBox="0 0 256 256"><path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z"></path></svg> Orders</router-link>
      <router-link to="/favorites" class="dropdown-item"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="15" fill="#000000" viewBox="0 0 256 256"><path d="M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z"></path></svg>Wallet</router-link>

      <div class="dropdown-divider"></div>
      <button @click="logout" class="dropdown-item logout-btn"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="15" fill="#000000" viewBox="0 0 256 256"><path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z"></path></svg>Log out</button>
    </div>
  </div>
</div>
    </div>
    
    <nav class="navigation">
      <div class="nav-container">
        <router-link to="/" class="nav-link" exact-active-class="active">
          HOME
        </router-link>
        <router-link to="/about" class="nav-link" active-class="active">
          ABOUT US
        </router-link>
        <router-link to="/gallery" class="nav-link" active-class="active">
          GALLERY
        </router-link>
        <router-link to="/contact" class="nav-link contact-btn" active-class="active">
          CONTACT US
        </router-link>
      </div>
    </nav>
  </header>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Header',
  setup() {
    const store = useStore()
    const router = useRouter()
    const searchQuery = ref('')
    const showUserMenu = ref(false)
    
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
    const user = computed(() => store.getters['auth/user'])
    
    const cartCount = computed(() => store.getters['cart/cartCount'])
    const wishlistCount = computed(() => store.getters['wishlist/itemCount'])

    const performSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({
          name: 'Gallery',
          query: { search: searchQuery.value.trim() }
        })
      }
    }
    
    // const showSignIn = () => {
    //   store.dispatch('ui/openModal', {
    //     type: 'auth',
    //     mode: 'signin'
    //   })
    // }
    
    // const showRegister = () => {
    //   store.dispatch('ui/openModal', {
    //     type: 'auth',
    //     mode: 'register'
    //   })
    // }
    const showSignIn = () => {
      router.push({ name: 'Signin' })
    }

    const showRegister = () => {
      router.push({ name: 'Register' })
    }

    
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }
    
    const logout = async () => {
      await store.dispatch('auth/logout')
      showUserMenu.value = false
      router.push('/')
    }
    
    return {
      searchQuery,
      showUserMenu,
      isAuthenticated,
      user,
      cartCount,
      wishlistCount,
      performSearch,
      showSignIn,
      showRegister,
      toggleUserMenu,
      logout
    }
  }
}
</script>

<style scoped>
.header {
  background: #4285f4;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
}

.header + .header,
.navigation + .navigation {
  display: none !important;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.logo-section {
  flex-shrink: 0;
}

.logo-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.logo-link:hover {
  opacity: 0.9;
}

.logo {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

.tagline {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 300;
}

.search-section {
  flex: 1;
  max-width: 500px;
}

.search-container {
  position: relative;
  display: flex;
  background: white;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  font-size: 1rem;
  outline: none;
  color: #333;
}

.search-input::placeholder {
  color: #999;
}

.search-button {
  padding: 0.75rem 1.5rem;
  background: #4285f4;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background 0.3s ease;
}

.search-button:hover {
  background: #3367d6;
}

.auth-section {
  flex-shrink: 0;
  position: relative;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.greeting {
  opacity: 0.9;
}

.auth-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.95rem;
  text-decoration: underline;
  transition: opacity 0.3s ease;
}

.auth-btn:hover {
  opacity: 0.8;
}

.separator {
  opacity: 0.7;
}

.user-menu {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
}

.welcome {
  font-size: 0.95rem;
  opacity: 0.9;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 20px;
  transition: background 0.3s ease;
}

.user-dropdown:hover {
  background: rgba(255, 255, 255, 0.1);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
}

.dropdown-arrow {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  z-index: 1000;
  margin-top: 0.5rem;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #333;
  transition: background 0.3s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-divider {
  height: 1px;
  background: #e5e5e5;
  margin: 0.5rem 0;
}


.wishlist-button, .cart-button {
  text-decoration: none;
  color: inherit;
  position: relative;
  font-size: 1.2rem;
  margin-left: 0.5rem;
}

.badge {
  position: absolute;
  top: -10px;
  right: -5px;
  background: #ff4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
}

/* Single Navigation Bar */
.navigation {
  background: #333;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-link {
  padding: 1rem 1.5rem;
  color: #ccc;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  color: white;
  background: #4285f4;
  border-bottom-color: #4285f4;
}

.contact-btn {
  background: #4285f4;
  color: white;
  border-radius: 25px;
  margin-left: 1rem;
  border: 2px solid #4285f4;
}

.contact-btn:hover {
  background: white;
  color: #4285f4;
}

.contact-btn.active {
  background: white;
  color: #4285f4;
}

.navigation::before,
.navigation::after,
.nav-container::before,
.nav-container::after {
  display: none !important;
}

@media (max-width: 1200px) {
  .nav-link {
    padding: 1rem 1rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 992px) {
  .header-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-section {
    order: 3;
    max-width: 100%;
  }
  
  .nav-container {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    justify-content: flex-start;
    padding: 0 1rem;
  }
  
  .nav-link {
    padding: 1rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .contact-btn {
    margin-left: 0.5rem;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 1rem;
  }
  
  .logo {
    font-size: 1.5rem;
  }
  
  .tagline {
    font-size: 0.8rem;
  }
  
  .auth-buttons {
    font-size: 0.85rem;
  }
  
  .nav-link {
    padding: 0.75rem 0.5rem;
  }
}
</style>
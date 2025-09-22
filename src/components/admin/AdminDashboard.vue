<template>
  <div class="dashboard-container">
    <!-- Main Content -->
    <main class="main-content">
      <!-- Dashboard Cards -->
      <div class="dashboard-grid">
        <div 
          v-for="card in dashboardCards" 
          :key="card.id"
          class="dashboard-card"
          :class="card.color"
          @click="handleCardClick(card)"
        >
          <div class="card-content">
            <div class="card-title">{{ card.title }}</div>
          </div>
          
          <div class="card-icon">
            <component :is="getIconComponent(card.icon)" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      dashboardCards: [
        { id: 1, title: 'Users', color: 'purple-card', icon: 'users', route: '/admin/users' },
        { id: 2, title: 'Categories', color: 'blue-card', icon: 'shopping-bag', route: '/admin/categories' },
        { id: 3, title: 'Brands', color: 'green-card', icon: 'chart', route: '/admin/brands' },
        { id: 4, title: 'Products', color: 'yellow-card', icon: 'user', route: '/admin/products' },
        { id: 5, title: 'Orders', color: 'red-card', icon: 'orders', route: '/admin/orders' },
        { id: 6, title: 'Art Brands', color: 'orange-card', icon: 'palette', route: '/admin/brands' },
        { id: 7, title: 'Artist', color: 'pink-card', icon: 'artist', route: '/admin/artist' } // New Artist card
      ]
    }
  },
  methods: {
    handleCardClick(card) {
      this.$router.push(card.route);
    },
    
    getIconComponent(iconName) {
      const icons = {
        'shopping-bag': 'ShoppingBagIcon',
        'chart': 'ChartIcon', 
        'user': 'UserIcon',
        'orders': 'OrdersIcon',
        'artist': 'ArtistIcon' // New icon
      };
      return icons[iconName] || 'DefaultIcon';
    }
  },
  
  components: {
    ShoppingBagIcon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"/>
      </svg>`
    },
    ChartIcon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>`
    },
    UserIcon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>`
    },
    OrdersIcon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
      </svg>`
    },
    ArtistIcon: { // New Artist icon
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 2a5 5 0 00-5 5v10a5 5 0 0010 0V7a5 5 0 00-5-5z"/>
      </svg>`
    }
  }
}
</script>

<style>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);
  font-family: 'Inter', sans-serif;
  color: #1f2937;
}
.main-content { padding: 32px; max-width: 1400px; margin: 0 auto; }
.dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 28px; margin-bottom: 48px; }
.dashboard-card { border-radius: 16px; padding: 40px 28px; transition: all 0.3s ease; cursor: pointer; position: relative; overflow: hidden; min-height: 140px; display: flex; align-items: center; justify-content: center; }
.dashboard-card:hover { transform: translateY(-6px); box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15); }

.purple-card { background: #a78bfa; }
.blue-card { background: #74b9ff; }
.green-card { background: #55efc4; }
.yellow-card { background: #fdcb6e; }
.red-card { background: #fd79a8; }
.orange-card { background: #f97316; }
.pink-card { background: #f472b6; } /* Artist card color */

.card-content { text-align: center; z-index: 2; position: relative; }
.card-title { font-size: 20px; font-weight: 600; color: white; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); }
.card-icon { position: absolute; top: 50%; right: 28px; transform: translateY(-50%); width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; border-radius: 12px; opacity: 0.2; z-index: 1; }
.card-icon svg { width: 40px; height: 40px; color: white; }

@media (max-width: 768px) {
  .main-content { padding: 20px; }
  .dashboard-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 50px; margin-bottom: 60px; }
}

@media (max-width: 640px) {
  .card-title { font-size: 18px; }
  .card-icon { width: 60px; height: 60px; }
  .card-icon svg { width: 32px; height: 32px; }
}
</style>

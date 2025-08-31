<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <div :class="['sidebar', { collapsed: isCollapsed }]">
      <h2 v-if="!isCollapsed" class="sidebar-title">Admin Panel</h2>
      <button class="collapse-btn" @click="toggleSidebar">
        <i :class="isCollapsed ? 'fa fa-chevron-right' : 'fa fa-chevron-left'"></i>
      </button>

      <!-- Sidebar links -->
      <router-link 
        :to="'/admin/dashboard'" 
        :class="['sidebar-button', { 'active': $route.path === '/admin/dashboard' }]"
      >
        <i class="fa fa-dashboard"></i> 
        <span v-if="!isCollapsed">Dashboard</span>
      </router-link>

      <router-link 
        :to="'/admin/users'" 
        :class="['sidebar-button', { 'active': $route.path === '/admin/users' }]"
      >
        <i class="fa fa-user"></i> 
        <span v-if="!isCollapsed">Users</span>
      </router-link>

      <router-link 
        :to="'/admin/orders'" 
        :class="['sidebar-button', { 'active': $route.path === '/admin/orders' }]"
      >
        <i class="fa fa-shopping-cart"></i>
        <span v-if="!isCollapsed">Orders</span>
      </router-link>

      <router-link 
  :to="'/admin/inventory'" 
  :class="['sidebar-button', { 'active': $route.path === '/admin/inventory' }]"
>
  <i class="fa fa-archive"></i> 
  <span v-if="!isCollapsed">Inventory</span>
</router-link>
      <router-link 
        :to="'/admin/brands'" 
        :class="['sidebar-button', { 'active': $route.path === '/admin/brands' }]"
      >
        <i class="fa fa-tags"></i> 
        <span v-if="!isCollapsed">Art Brands</span>
      </router-link>

      <router-link 
        :to="'/admin/shoes'" 
        :class="['sidebar-button', { 'active': $route.path === '/admin/shoes' }]"
      >
        <i class="fa fa-shopping-bag"></i> 
        <span v-if="!isCollapsed">Arts</span>
      </router-link>

      <router-link 
        :to="'/admin/categories'" 
        :class="['sidebar-button', { 'active': $route.path === '/admin/categories' }]"
      >
        <i class="fa fa-list"></i> 
        <span v-if="!isCollapsed">Categories</span>
      </router-link>

      <router-link 
        :to="'/admin/notifications'" 
        :class="['sidebar-button', { 'active': $route.path === '/admin/notifications' }]"
      >
        <i class="fa fa-bell"></i> 
        <span v-if="!isCollapsed">Notifications</span>
      </router-link>

    </div>

    <!-- Main content -->
    <div class="admin-content">
      <div class="admin-header">
        <h1>{{ pageTitle }}</h1>
      </div>
      <div class="admin-main">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'AdminLayout',
  setup() {
    const route = useRoute()
    const isCollapsed = ref(false)

    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value
    }

    const pageTitle = computed(() => {
      const path = route.path.split('/').pop()
      return path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Dashboard'
    })

    return {
      isCollapsed,
      toggleSidebar,
      pageTitle
    }
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: width 0.3s;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-title {
  font-size: 1.5em;
  margin-bottom: 20px;
  text-align: center;
}

.sidebar-button {
  background: none;
  border: none;
  color: white;
  padding: 10px 15px;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.3s;
  text-decoration: none;
  display: block;
}

.sidebar-button:hover,
.sidebar-button.active {
  background-color: #34495e;
  transform: scale(1.05);
}

.sidebar-button i {
  margin-right: 10px;
  width: 20px;
}

.admin-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #ecf0f1;
  overflow: hidden;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: fadeInDown 1s ease-in-out;
}

.admin-main {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

@keyframes fadeInDown {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.collapse-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 5px;
  border-radius: 3px;
}

.collapse-btn:hover {
  background-color: #34495e;
}

.collapse-btn i {
  font-size: 16px;
}
</style>

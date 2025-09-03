import { createRouter, createWebHistory } from 'vue-router'

// Public views
import Home from '@/views/Home.vue'
import Gallery from '@/views/Gallery.vue'
import MyOrders from '@/views/MyOrders.vue'


import Contact from '@/views/Contact.vue'
//import Events from '@/views/Events.vue'
//import Exhibitions from '@/views/Exhibitions.vue'
//import Gallery from '@/views/Gallery.vue'
//import Home from '@/views/Home.vue'

// Admin views
import AdminCategories from '@/components/admin/AdminCategories.vue'
import AdminDashboard from '@/components/admin/AdminDashboard.vue'
import NotificationPage from '@/components/admin/NotificationPage.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ArtBrand from '@/views/ArtBrand.vue'
import Orders from '@/admin layout component/admin/Orders.vue'

const routes = [
  // Public routes
  { path: '/', name: 'Home', component: Home },
  { path: '/gallery', name: 'Gallery', component: Gallery },
  {path : '/myorders', name: 'MyOrders', component: MyOrders},
  //{ path: '/artists', name: 'Artists', component: Artists },
  //{ path: '/collections', name: 'Collections', component: Collections },
//  { path: '/exhibitions', name: 'Exhibitions', component: Exhibitions },
//  { path: '/events', name: 'Events', component: Events },
  //{ path: '/commission', name: 'Commission', component: Commission },
  {path: '/contact', name: 'Contact', component: Contact },

  // Admin routes
  {
    path: '/admin',
    component: AdminLayout,
    children: [

      { path: 'dashboard',name: 'AdminDashboard', component: AdminDashboard},
      { path: '', redirect: '/admin/categories' },
      { path: 'categories', name: 'AdminCategories', component: AdminCategories },
      { path: 'brands', name: 'ArtBrand', component: ArtBrand }, // <-- moved here
      {path: "notifications", name: "AdminNotifications",component: NotificationPage},
      {path: 'orders', name: "Orders", component: Orders}

    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

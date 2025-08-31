import { createRouter, createWebHistory } from 'vue-router'

// Public views
import Home from '@/views/Home.vue'
import Gallery from '@/views/Gallery.vue'
import Artists from '@/views/Artists.vue'
import Collections from '@/views/Collections.vue'
import Exhibitions from '@/views/Exhibitions.vue'
import Events from '@/views/Events.vue'
import Commission from '@/views/Commission.vue'
import Contact from '@/views/Contact.vue'
import Cart from '@/views/cart/Cart.vue'
import MyOrders from '@/views/MyOrders.vue'  // Customer orders


// Admin components
import AdminLayout from '@/components/layout/AdminLayout.vue'
import AdminCategories from '@/components/admin/AdminCategories.vue'
 import Orders from '@/components/admin/Orders.vue'
 import Inventory from '@/components/admin/Inventory.vue'
      // Admin orders

const routes = [
  // Public routes
  { path: '/', name: 'Home', component: Home },
  { path: '/gallery', name: 'Gallery', component: Gallery },
  { path: '/artists', name: 'Artists', component: Artists },
  { path: '/collections', name: 'Collections', component: Collections },
  { path: '/exhibitions', name: 'Exhibitions', component: Exhibitions },
  { path: '/events', name: 'Events', component: Events },
  { path: '/commission', name: 'Commission', component: Commission },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/myorders', name: 'MyOrders', component: MyOrders }, // Customer orders

  // Admin routes
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', redirect: '/admin/categories' },
      { path: 'categories', name: 'AdminCategories', component: AdminCategories },
      { path: 'orders', name: 'AdminOrders', component: Orders }, // Admin orders
      { path: 'inventory', name: 'AdminInventory', component: Inventory }
    ]
  },

  // Catch-all 404
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

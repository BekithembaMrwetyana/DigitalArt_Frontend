import { createRouter, createWebHistory } from 'vue-router'

// Import views
import Artists from '@/views/Artists.vue'
import Collections from '@/views/Collections.vue'
import Commission from '@/views/Commission.vue'
import Contact from '@/views/Contact.vue'
import Events from '@/views/Events.vue'
import Exhibitions from '@/views/Exhibitions.vue'
import Gallery from '@/views/Gallery.vue'
import Home from '@/views/Home.vue'
import Cart from '@/views/cart/Cart.vue'

// Import admin components
import AdminCategories from '@/components/admin/AdminCategories.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

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
  {path: '/cart',name: 'Cart',component: Cart},
  
  // Admin routes with nested layout
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirect: '/admin/categories'
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: AdminCategories
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
import { createRouter, createWebHistory } from 'vue-router'

// Public views
import Contact from '@/views/Contact.vue'
import Gallery from '@/views/Gallery.vue'
import Home from '@/views/Home.vue'

// Admin views
import ArtBrand from '@/views/ArtBrand.vue'
import AdminCategories from '@/components/admin/AdminCategories.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const routes = [
  // Public routes
  { path: '/', name: 'Home', component: Home },
  { path: '/gallery', name: 'Gallery', component: Gallery },
  { path: '/contact', name: 'Contact', component: Contact },

  // Admin routes
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', redirect: '/admin/categories' },
      { path: 'categories', name: 'AdminCategories', component: AdminCategories },
      { path: 'brands', name: 'ArtBrand', component: ArtBrand } // <-- moved here
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

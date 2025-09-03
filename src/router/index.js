import { createRouter, createWebHistory } from 'vue-router'

// Public views

import Contact from '@/views/Contact.vue'
import Gallery from '@/views/Gallery.vue'
import About from '@/views/About.vue' // import About page
import Home from '@/views/Home.vue'
import Wishlist from '@/views/Wishlist.vue'

// Admin views
import AdminCategories from '@/components/admin/AdminCategories.vue'
import AdminDashboard from '@/components/admin/AdminDashboard.vue'
//import NotificationPage from '@/components/admin/NotificationPage.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ArtBrand from '@/views/ArtBrand.vue'

const routes = [
  // Public routes
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About }, // new About route
  { path: '/gallery', name: 'Gallery', component: Gallery },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/wishlist', name: 'Wishlist', component: Wishlist },

  //User routes

  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/User/Register.vue')
  },
  {
    path: '/login',
    name: 'Signin',
    component: () => import('@/views/User/Signin.vue')
  },


  // Admin routes
  {
    path: '/admin',
    component: AdminLayout,
    children: [

      { path: 'dashboard',name: 'AdminDashboard', component: AdminDashboard},
      { path: '', redirect: '/admin/categories' },
      { path: 'categories', name: 'AdminCategories', component: AdminCategories },
      { path: 'brands', name: 'ArtBrand', component: ArtBrand }, // <-- moved here
      //{path: "notifications", name: "AdminNotifications",component: NotificationPage}

    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

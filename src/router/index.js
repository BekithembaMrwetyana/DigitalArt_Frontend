import { createRouter, createWebHistory } from 'vue-router'

// Public views
import Contact from '@/views/Contact.vue'
import Gallery from '@/views/Gallery.vue'
import Artists from '@/views/Artists.vue'
import About from '@/views/About.vue'
import Home from '@/views/Home.vue'
import Wishlist from '@/views/Wishlist.vue'
import MyOrders from '@/views/MyOrders.vue'
import Cart from '@/views/cart/Cart.vue'
import ReviewPage from '@/views/ReviewPage.vue' // ✅ Add this import

// Admin views
import AdminCategories from '@/components/admin/AdminCategories.vue'
import AdminDashboard from '@/components/admin/AdminDashboard.vue'
import AdminProducts from '@/components/admin/AdminProducts.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ArtBrand from '@/views/ArtBrand.vue'
import Orders from '@/components/admin/Orders.vue'

import User from '@/components/admin/User.vue'
import Artist from '@/components/admin/Artist.vue'

const routes = [
  // Public routes
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/gallery', name: 'Gallery', component: Gallery },
  { path: '/artists', name: 'Artists', component: Artists },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/wishlist', name: 'Wishlist', component: Wishlist },
  { path: '/myorders', name: 'MyOrders', component: MyOrders },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/reviews', name: 'Reviews', component: ReviewPage }, // ✅ Add this route

  // User routes
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/User/Register.vue')
  },
  {
    path: '/signin',
    name: 'Signin',
    component: () => import('@/views/User/Signin.vue')
  },

  // Admin routes
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard },
      { path: '', redirect: '/admin/categories' },
      { path: 'categories', name: 'AdminCategories', component: AdminCategories },
      { path: 'products', name: 'AdminProducts', component: AdminProducts },
      { path: 'brands', name: 'ArtBrand', component: ArtBrand },
      { path: 'orders', name: 'Orders', component: Orders },
      
      { path: 'users', name: 'User', component: User },
      { path: 'artist', name: 'Artist', component: Artist },
      { path: 'brands', name: 'ArtBrand', component: ArtBrand }, // <-- moved here
      //{path: "notifications", name: "AdminNotifications",component: NotificationPage}
      {path: 'orders', name: 'Orders', component: Orders},

      {path: 'users', name:'User', component: User },
       {path: 'artist', name: 'Artist', component: Artist},
       { path: 'register', name: 'AdminRegister', component: () => import('@/views/Admin/AdminRegister.vue') }


    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to protect admin routes
router.beforeEach((to, from, next) => {
  const isAdminRoute = to.path.startsWith('/admin')
  const user = JSON.parse(localStorage.getItem('user'))

  if (isAdminRoute) {
    if (user && user.role === 'ADMIN') {
      next()
    } else {
      // Redirect to admin register if not logged in as admin
      if (to.path !== '/admin/register') {
        next('/admin/register')
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router


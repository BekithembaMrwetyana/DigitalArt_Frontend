import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/main.css'

// Simulate logged-in user for testing MyOrders page
const testUser = { userId: 10, firstName: 'Test', lastName: 'User' }
localStorage.setItem('user', JSON.stringify(testUser))

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')


import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export function useAuth() {
  const store = useStore()
  const loading = ref(false)
  const error = ref(null)
  
  const user = computed(() => store.getters['auth/user'])
  const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
  const token = computed(() => store.getters['auth/token'])
  
  const login = async (credentials) => {
    loading.value = true
    error.value = null
    try {
      await store.dispatch('auth/login', credentials)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  const register = async (userData) => {
    loading.value = true
    error.value = null
    try {
      await store.dispatch('auth/register', userData)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  const logout = () => {
    store.dispatch('auth/logout')
  }
  
  return {
    user,
    isAuthenticated,
    token,
    loading,
    error,
    login,
    register,
    logout
  }
}
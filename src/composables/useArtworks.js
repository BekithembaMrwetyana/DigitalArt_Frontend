import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export function useArtworks() {
  const store = useStore()
  const loading = ref(false)
  const error = ref(null)
  
  const artworks = computed(() => store.getters['artworks/allArtworks'])
  const filteredArtworks = computed(() => store.getters['artworks/filteredArtworks'])
  const searchFilters = computed(() => store.getters['artworks/searchFilters'])
  
  const fetchArtworks = async () => {
    loading.value = true
    error.value = null
    try {
      await store.dispatch('artworks/fetchAll')
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  const updateFilters = (filters) => {
    store.dispatch('artworks/updateFilters', filters)
  }
  
  const resetFilters = () => {
    store.dispatch('artworks/resetFilters')
  }
  
  const searchArtworks = (query) => {
    // Implement search logic
    console.log('Searching for:', query)
  }
  
  return {
    artworks,
    filteredArtworks,
    searchFilters,
    loading,
    error,
    fetchArtworks,
    updateFilters,
    resetFilters,
    searchArtworks
  }
}
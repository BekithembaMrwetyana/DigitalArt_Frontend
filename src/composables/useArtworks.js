import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export function useArtworks() {
  const store = useStore()

  const loading = computed(() => store.getters['artworks/loading'])
  const error = computed(() => store.getters['artworks/error'])
  const artworks = computed(() => store.getters['artworks/allArtworks'])
  const filteredArtworks = computed(() => store.getters['artworks/filteredArtworks'])
  const filters = computed(() => store.getters['artworks/filters'])

  const fetchArtworks = () => store.dispatch('artworks/fetchArtworks')
  const updateFilters = (newFilters) => store.dispatch('artworks/updateFilters', newFilters)
  const resetFilters = () => store.dispatch('artworks/resetFilters')

  onMounted(() => {
    fetchArtworks()
  })

  return {
    artworks,
    filteredArtworks,
    filters,
    loading,
    error,
    fetchArtworks,
    updateFilters,
    resetFilters
  }
}

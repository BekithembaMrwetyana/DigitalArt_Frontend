import { computed } from 'vue'
import { useStore } from 'vuex'

export function useModal() {
  const store = useStore()
  
  const isOpen = computed(() => store.getters['ui/selectedArtwork'] !== null)
  const selectedArtwork = computed(() => store.getters['ui/selectedArtwork'])
  
  const openModal = (artwork) => {
    store.dispatch('ui/selectArtwork', artwork)
  }
  
  const closeModal = () => {
    store.dispatch('ui/closeModal')
  }
  
  return {
    isOpen,
    selectedArtwork,
    openModal,
    closeModal
  }
}
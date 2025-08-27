import axios from 'axios'

const BACKEND_URL = 'http://localhost:8080/products'

const state = {
  artworks: [],
  filters: {
    category: '',
    artist: '',
    priceRange: '',
    size: '',
    availability: '',
    sortBy: 'newest'
  },
  loading: false,
  error: null
}

const mutations = {
  SET_ARTWORKS(state, artworks) {
    state.artworks = artworks
  },
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },
  RESET_FILTERS(state) {
    state.filters = {
      category: '',
      artist: '',
      priceRange: '',
      size: '',
      availability: '',
      sortBy: 'newest'
    }
  },
  SET_LOADING(state, value) {
    state.loading = value
  },
  SET_ERROR(state, value) {
    state.error = value
  }
}

const actions = {
  async fetchArtworks({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await axios.get(`${BACKEND_URL}/getAll`)
      const artworks = response.data.map(product => ({
        id: product.productID,
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category?.name || 'Unknown',
        image: product.imageUrl ? `http://localhost:8080/${product.imageUrl}` : '/placeholder-art.jpg'
      }))
      commit('SET_ARTWORKS', artworks)
    } catch (err) {
      commit('SET_ERROR', err.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  updateFilters({ commit }, filters) {
    commit('SET_FILTERS', filters)
  },

  resetFilters({ commit }) {
    commit('RESET_FILTERS')
  }
}

const getters = {
  allArtworks: state => state.artworks,

  filteredArtworks: state => {
    const { category, priceRange, sortBy } = state.filters
    let filtered = state.artworks

    // Filter by category
    if (category) {
      filtered = filtered.filter(a => a.category.toLowerCase() === category.toLowerCase())
    }

    // Filter by price
    if (priceRange) {
      let min, max
      if (priceRange.includes('+')) {
        min = Number(priceRange.replace('+',''))
        max = Infinity
      } else {
        [min, max] = priceRange.split('-').map(Number)
      }
      filtered = filtered.filter(a => a.price >= min && a.price <= max)
    }

    // Sorting
    switch(sortBy) {
      case 'price-low': filtered.sort((a,b) => a.price - b.price); break
      case 'price-high': filtered.sort((a,b) => b.price - a.price); break
      case 'title': filtered.sort((a,b) => a.title.localeCompare(b.title)); break
      default: break
    }

    return filtered
  },

  loading: state => state.loading,
  error: state => state.error,
  filters: state => state.filters
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

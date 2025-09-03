import axios from 'axios'

const BACKEND_URL = 'http://localhost:8080/digital_artDB/api'

const state = {
  products: [],
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
  SET_PRODUCTS(state, products) {
    state.products = products
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
  async fetchProducts({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await axios.get(`${BACKEND_URL}/products`)
      const products = response.data.map(product => ({
        id: product.productID,
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category?.name || 'Unknown',
        artist: 'Unknown', // Backend doesn't provide artist
        image: product.imageUrl ? `http://localhost:8080/digital_artDB${product.imageUrl}` : (product.image ? `data:image/jpeg;base64,${product.image}` : '/placeholder-art.jpg')
      }))
      commit('SET_PRODUCTS', products)
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
  allProducts: state => state.products,

  filteredProducts: state => {
    const { category, priceRange, sortBy } = state.filters
    let filtered = state.products

    // Filter by category
    if (category) {
      filtered = filtered.filter(product => product.category.toLowerCase() === category.toLowerCase())
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
      filtered = filtered.filter(product => product.price >= min && product.price <= max)
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

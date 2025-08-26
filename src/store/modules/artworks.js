const state = {
  artworks: [
    {
      id: 1,
      title: 'Neon Dreams',
      artist: 'Alex Chen',
      category: 'digital',
      price: 299,
      type: 'featured',
      gradient: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
      description: 'A stunning digital artwork exploring the intersection of dreams and reality.'
    },
    {
      id: 2,
      title: 'Ocean Depths',
      artist: 'Maria Rodriguez',
      category: 'abstract',
      price: 450,
      type: 'new',
      gradient: 'linear-gradient(45deg, #667eea, #764ba2)',
      description: 'Abstract representation of the mysterious ocean depths.'
    },
    {
      id: 3,
      title: 'Urban Pulse',
      artist: 'David Kim',
      category: 'photography',
      price: 199,
      type: 'trending',
      gradient: 'linear-gradient(45deg, #f093fb, #f5576c)',
      description: 'Capturing the vibrant energy of city life through digital manipulation.'
    },
    {
      id: 4,
      title: 'Digital Flora',
      artist: 'Sarah Johnson',
      category: 'digital',
      price: 350,
      type: 'featured',
      gradient: 'linear-gradient(45deg, #4facfe, #00f2fe)',
      description: 'Reimagining nature through a digital lens with vibrant colors.'
    },
    {
      id: 5,
      title: 'Cosmic Journey',
      artist: 'Alex Chen',
      category: 'abstract',
      price: 599,
      type: 'new',
      gradient: 'linear-gradient(45deg, #43e97b, #38f9d7)',
      description: 'An exploration of space and time through abstract digital art.'
    },
    {
      id: 6,
      title: 'Portrait Study',
      artist: 'Maria Rodriguez',
      category: 'portrait',
      price: 275,
      type: 'trending',
      gradient: 'linear-gradient(45deg, #fa709a, #fee140)',
      description: 'Contemporary digital portrait with surreal elements.'
    }
  ],
  filters: {
    category: '',
    artist: '',
    priceRange: '',
    date: ''
  }
}

const mutations = {
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },
  RESET_FILTERS(state) {
    state.filters = { category: '', artist: '', priceRange: '', date: '' }
  }
}

const actions = {
  updateFilters({ commit }, filters) {
    commit('SET_FILTERS', filters)
  },
  resetFilters({ commit }) {
    commit('RESET_FILTERS')
  }
}

const getters = {
  allArtworks: state => state.artworks,
  filteredArtworks: state => type => {
    return state.artworks.filter(art => art.type === type)
  },
  searchFilters: state => state.filters
}

export default { namespaced: true, state, mutations, actions, getters }

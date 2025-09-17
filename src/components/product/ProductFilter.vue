<template>
  <div class="product-filter">
    <div class="filter-section">
      <h3 class="filter-title">Filter Products</h3>
      
    
      <div class="filter-group">
        <label class="filter-label">Category</label>
        <select 
          v-model="filters.category" 
          @change="updateFilters"
          class="filter-select"
        >
          <option value="">All Categories</option>
          <option 
            v-for="category in categories" 
            :key="category.categoryID" 
            :value="category.name"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      
      <div class="filter-group">
        <label class="filter-label">Artist</label>
        <select 
          v-model="filters.artist" 
          @change="updateFilters"
          class="filter-select"
        >
          <option value="">All Artists</option>
          <option 
            v-for="artist in artists" 
            :key="artist.id" 
            :value="artist.id"
          >
            {{ artist.name }}
          </option>
        </select>
      </div>

     
      <div class="filter-group">
        <label class="filter-label">Price Range</label>
        <select 
          v-model="filters.priceRange" 
          @change="updateFilters"
          class="filter-select"
        >
          <option value="">Any Price</option>
          <option value="0-200">R0 - R200</option>
          <option value="200-400">R200 - R400</option>
          <option value="400-800">R400- R800</option>
          <option value="800+">R800+</option>
        </select>
      </div>

    
      <div class="filter-group">
        <label class="filter-label">Size</label>
        <select 
          v-model="filters.size" 
          @change="updateFilters"
          class="filter-select"
        >
          <option value="">Any Size</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

     
      <div class="filter-group">
        <label class="filter-label">Availability</label>
        <select 
          v-model="filters.availability" 
          @change="updateFilters"
          class="filter-select"
        >
          <option value="">All</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      
      <div class="filter-group">
        <label class="filter-label">Sort By</label>
        <select 
          v-model="filters.sortBy" 
          @change="updateFilters"
          class="filter-select"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="title">Title (A-Z)</option>
          <option value="artist">Artist Name</option>
        </select>
      </div>

    
      <button 
        @click="clearFilters" 
        class="clear-filters-btn"
        :disabled="!hasActiveFilters"
      >
        Clear All Filters
      </button>
    </div>

   
    <div v-if="hasActiveFilters" class="active-filters">
      <h4 class="active-filters-title">Active Filters:</h4>
      <div class="filter-tags">
        <span v-if="filters.category" class="filter-tag">
          Category: {{ filters.category }}
          <button @click="removeFilter('category')" class="remove-filter">×</button>
        </span>
        <span v-if="filters.artist" class="filter-tag">
          Artist: {{ getArtistName(filters.artist) }}
          <button @click="removeFilter('artist')" class="remove-filter">×</button>
        </span>
        <span v-if="filters.priceRange" class="filter-tag">
          Price: {{ getPriceRangeLabel(filters.priceRange) }}
          <button @click="removeFilter('priceRange')" class="remove-filter">×</button>
        </span>
        <span v-if="filters.size" class="filter-tag">
          Size: {{ filters.size }}
          <button @click="removeFilter('size')" class="remove-filter">×</button>
        </span>
        <span v-if="filters.availability" class="filter-tag">
          {{ filters.availability === 'available' ? 'Available Only' : 'Sold Items' }}
          <button @click="removeFilter('availability')" class="remove-filter">×</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllCategories } from '@/services/categoryService'
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ProductFilter',
  emits: ['filtersChanged'],
  setup(props, { emit }) {
    const store = useStore()
    
    const filters = ref({
      category: '',
      artist: '',
      priceRange: '',
      size: '',
      availability: '',
      sortBy: 'newest'
    })

    const categories = ref([])
    const loading = ref(false)

    const artists = computed(() => store.getters['artists/allArtists'] || [])
    
    const hasActiveFilters = computed(() => {
      return Object.values(filters.value).some(value => value !== '' && value !== 'newest')
    })

    
    const fetchCategories = async () => {
      loading.value = true
      try {
        const categoriesData = await getAllCategories()
        categories.value = categoriesData || []
      } catch (error) {
        console.error('Error fetching categories:', error)
        categories.value = []
      } finally {
        loading.value = false
      }
    }

    const updateFilters = () => {
      emit('filtersChanged', { ...filters.value })
    }

    const clearFilters = () => {
      filters.value = {
        category: '',
        artist: '',
        priceRange: '',
        size: '',
        availability: '',
        sortBy: 'newest'
      }
      updateFilters()
    }

    const removeFilter = (filterKey) => {
      if (filterKey === 'sortBy') {
        filters.value[filterKey] = 'newest'
      } else {
        filters.value[filterKey] = ''
      }
      updateFilters()
    }

    const getArtistName = (artistId) => {
      const artist = artists.value.find(a => a.id === artistId)
      return artist ? artist.name : artistId
    }

    const getPriceRangeLabel = (range) => {
      const labels = {
        '0-200': 'R0 - R200',
        '200-400': 'R200 - R400',
        '400-800': 'R400 - R800',
        '800+': 'R800+'
      }
      return labels[range] || range
    }

    
    onMounted(() => {
      fetchCategories()
    })
    
    watch(filters, () => {
      updateFilters()
    }, { deep: true })

    return {
      filters,
      categories,
      artists,
      hasActiveFilters,
      loading,
      updateFilters,
      clearFilters,
      removeFilter,
      getArtistName,
      getPriceRangeLabel
    }
  }
}
</script>

<style scoped>
.product-filter {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.filter-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #555;
}

.filter-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.filter-select:disabled {
  background-color: #f8f9fa;
  opacity: 0.6;
  cursor: not-allowed;
}

.clear-filters-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-filters-btn:hover:not(:disabled) {
  background-color: #e9ecef;
}

.clear-filters-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.active-filters {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.active-filters-title {
  font-weight: 500;
  margin-bottom: 1rem;
  color: #333;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  background-color: #007bff;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  gap: 0.5rem;
}

.remove-filter {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.remove-filter:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .product-filter {
    padding: 1rem;
  }
  
  .filter-tags {
    gap: 0.25rem;
  }
  
  .filter-tag {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
  }
}
</style>
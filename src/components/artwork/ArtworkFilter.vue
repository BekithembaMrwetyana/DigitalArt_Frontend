<template>
  <div class="artwork-filter">
    <div class="filter-section">
      <h3 class="filter-title">Filter Artworks</h3>
      
      <!-- Category Filter -->
      <div class="filter-group">
        <label class="filter-label">Category</label>
        <select 
          v-model="filters.category" 
          @change="updateFilters"
          class="filter-select"
        >
          <option value="">All Categories</option>
          <option value="digital-painting">Digital Painting</option>
          <option value="3d-art">3D Art</option>
          <option value="photography">Photography</option>
          <option value="illustration">Illustration</option>
          <option value="mixed-media">Mixed Media</option>
        </select>
      </div>

      <!-- Artist Filter -->
      <div class="filter-group">
        <label class="filter-label">Artist</label>
        <select 
          v-model="filters.artist" 
          @change="updateFilters"
          class="filter-select"
        >
          <option value="">All Artists</option>
          <option v-for="artist in artists" :key="artist.id" :value="artist.id">
            {{ artist.name }}
          </option>
        </select>
      </div>

      <!-- Price Range Filter -->
      <div class="filter-group">
        <label class="filter-label">Price Range</label>
        <select 
          v-model="filters.priceRange" 
          @change="updateFilters"
          class="filter-select"
        >
          <option value="">Any Price</option>
          <option value="0-500">R0 - R500</option>
          <option value="500-1000">R500 - R1,000</option>
          <option value="1000-2500">R1,000 - R2,500</option>
          <option value="2500+">R2,500+</option>
        </select>
      </div>

      <!-- Size Filter -->
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

      <!-- Availability Filter -->
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

      <!-- Sort Options -->
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

      <!-- Clear Filters Button -->
      <button 
        @click="clearFilters" 
        class="clear-filters-btn"
        :disabled="!hasActiveFilters"
      >
        Clear All Filters
      </button>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="active-filters">
      <h4 class="active-filters-title">Active Filters:</h4>
      <div class="filter-tags">
        <span v-if="filters.category" class="filter-tag">
          Category: {{ getCategoryLabel(filters.category) }}
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
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ArtworkFilter',
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

    const artists = computed(() => store.getters['artists/allArtists'] || [])
    
    const hasActiveFilters = computed(() => {
      return Object.values(filters.value).some(value => value !== '' && value !== 'newest')
    })

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

    const getCategoryLabel = (category) => {
      const labels = {
        'digital-painting': 'Digital Painting',
        '3d-art': '3D Art',
        'photography': 'Photography',
        'illustration': 'Illustration',
        'mixed-media': 'Mixed Media'
      }
      return labels[category] || category
    }

    const getArtistName = (artistId) => {
      const artist = artists.value.find(a => a.id === artistId)
      return artist ? artist.name : artistId
    }

    const getPriceRangeLabel = (range) => {
      const labels = {
        '0-500': '$0 - $500',
        '500-1000': '$500 - $1,000',
        '1000-2500': '$1,000 - $2,500',
        '2500+': '$2,500+'
      }
      return labels[range] || range
    }

    // Watch for external filter changes
    watch(filters, () => {
      updateFilters()
    }, { deep: true })

    return {
      filters,
      artists,
      hasActiveFilters,
      updateFilters,
      clearFilters,
      removeFilter,
      getCategoryLabel,
      getArtistName,
      getPriceRangeLabel
    }
  }
}
</script>

<style scoped>
.artwork-filter {
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
  .artwork-filter {
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
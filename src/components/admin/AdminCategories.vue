<template>
  <div class="category-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">Category Page</h1>
        <nav class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">Home</router-link>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">Category</span>
        </nav>
      </div>
    </div>

    <!-- Category List Section -->
    <div class="category-list-section">
      <div class="section-header">
        <h2 class="section-title">Category List</h2>
        <button class="add-new-btn" @click="showAddForm = true">
          <i class="fas fa-plus"></i> Add New
        </button>
      </div>

      <!-- Controls Row -->
      <div class="controls-row">
        
        
        <div class="search-control">
          <span>Search:</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            class="search-input"
            placeholder=""
            @input="filterCategories"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="table-container">


        <table class="data-table">
          <thead>
            <tr>
              <th class="sortable" @click="sortBy('id')">
                Sl No.
                <i :class="getSortIcon('id')" class="sort-icon"></i>
              </th>
              <th class="sortable" @click="sortBy('name')">
                Category Name
                <i :class="getSortIcon('name')" class="sort-icon"></i>
              </th>
              <th>Description</th>
              <th>Image</th>      <!-- Added -->
              <th>Status</th>     <!-- Added -->
              <th class="action-cell">Action</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="(category, index) in paginatedCategories" :key="category.id">
              <td>{{ (currentPage - 1) * parseInt(entriesPerPage) + index + 1 }}</td>
              <td class="category-name">{{ category.name }}</td>
              <td class="description">{{ category.description || '-' }}</td>

                <!-- Image -->
                <td>
                <img 
                    v-if="category.imageUrl" 
                    :src="category.imageUrl" 
                    alt="Category Image" 
                    class="category-img"
                />
                <span v-else>No image</span>
                </td>

     <!-- Status -->
    <td>
        <span v-if="category.status === 'active'" class="status-active">Active</span>
        <span v-else class="status-inactive">Inactive</span>
    </td>

              <td class="action-cell">
                <button class="action-btn edit-btn" @click="editCategory(category)" title="Edit">
                  Edit
                </button>
                <button class="action-btn delete-btn" @click="confirmDelete(category)" title="Delete">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-container">
        <div class="pagination-info">
          Showing {{ startEntry }} to {{ endEntry }} of {{ filteredCategories.length }} entries
        </div>
        <div class="pagination-controls">
          
          <button 
            v-for="page in visiblePages" 
            :key="page"
            :class="['pagination-btn', { active: page === currentPage }]"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
         
            
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddForm || editingCategory" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingCategory ? 'Edit Category' : 'Add New Category' }}</h3>
          <button class="close-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveCategory" class="category-form">
          <div class="form-group">
            <label for="categoryName">Category Name *</label>
            <input 
              id="categoryName"
              v-model="categoryForm.name" 
              type="text"
              placeholder="Enter category name"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="categoryDescription">Description</label>
            <textarea 
              id="categoryDescription"
              v-model="categoryForm.description" 
              placeholder="Enter description"
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="submit" class="btn btn-primary">
              {{ editingCategory ? 'Update' : 'Add' }} Category
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deletingCategory" class="modal-overlay" @click="deletingCategory = null">
      <div class="modal-content delete-modal" @click.stop>
        <div class="modal-header">
          <h3>Confirm Delete</h3>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete the category "<strong>{{ deletingCategory.name }}</strong>"?</p>
          <p class="warning-text">This action cannot be undone.</p>
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary" @click="deletingCategory = null">Cancel</button>
          <button class="btn btn-danger" @click="deleteCategory">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  deleteCategory,
  saveCategory,
} from "@/services/categoryService";

export default {
  name: 'AdminCategories',
  data() {
    return {
        categories: [],
        newCategory: {

        categoryId: null,

        categoryName: '',

        categoryDescription: '',

        categoryImage: null,

        },
    
     

      filteredCategories: [],
      searchQuery: '',
      entriesPerPage: '10',
      currentPage: 1,
      sortKey: '',
      sortOrder: 'asc',
      
      // Modal states - simplified
      showAddForm: false,
      editingCategory: null,
      deletingCategory: null,
      
      // Form data - simplified
      categoryForm: {
        name: '',
        description: ''
      }
    }
  },
  
  computed: {
    totalPages() {
      return Math.ceil(this.filteredCategories.length / parseInt(this.entriesPerPage))
    },
    
    paginatedCategories() {
      const start = (this.currentPage - 1) * parseInt(this.entriesPerPage)
      const end = start + parseInt(this.entriesPerPage)
      return this.filteredCategories.slice(start, end)
    },
    
    visiblePages() {
      const pages = []
      const total = this.totalPages
      const current = this.currentPage
      
      if (total <= 5) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        if (current <= 3) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i)
          }
        } else if (current >= total - 2) {
          for (let i = total - 4; i <= total; i++) {
            pages.push(i)
          }
        } else {
          for (let i = current - 2; i <= current + 2; i++) {
            pages.push(i)
          }
        }
      }
      
      return pages
    },
    
    startEntry() {
      return (this.currentPage - 1) * parseInt(this.entriesPerPage) + 1
    },
    
    endEntry() {
      const end = this.currentPage * parseInt(this.entriesPerPage)
      return Math.min(end, this.filteredCategories.length)
    }
  },
  
  mounted() {
    this.filteredCategories = [...this.categories]
  },
  
  methods: {
    // Simplified CRUD methods matching second code structure
    saveCategory() {
      if (this.editingCategory) {
        // Update existing category
        const index = this.categories.findIndex(c => c.id === this.editingCategory.id)
        if (index !== -1) {
          this.categories[index] = {
            ...this.editingCategory,
            name: this.categoryForm.name,
            description: this.categoryForm.description
          }
        }
      } else {
        // Add new category
        const newCategory = {
          id: Math.max(...this.categories.map(c => c.id)) + 1,
          name: this.categoryForm.name,
          description: this.categoryForm.description,
          createdAt: new Date()
        }
        this.categories.push(newCategory)
      }
      
      this.filterCategories()
      this.closeModal()
    },

    editCategory(category) {
      this.editingCategory = category
      this.categoryForm = {
        name: category.name,
        description: category.description
      }
    },

    confirmDelete(category) {
      this.deletingCategory = category
    },

    deleteCategory() {
      this.categories = this.categories.filter(c => c.id !== this.deletingCategory.id)
      this.filterCategories()
      this.deletingCategory = null
    },

    closeModal() {
      this.showAddForm = false
      this.editingCategory = null
      this.categoryForm = { name: '', description: '' }
    },

    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
    },
    
    // Keep existing utility methods from first code
    filterCategories() {
      if (!this.searchQuery.trim()) {
        this.filteredCategories = [...this.categories]
      } else {
        const query = this.searchQuery.toLowerCase()
        this.filteredCategories = this.categories.filter(category =>
          category.name.toLowerCase().includes(query) ||
          (category.description && category.description.toLowerCase().includes(query))
        )
      }
      this.currentPage = 1
    },
    
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortKey = key
        this.sortOrder = 'asc'
      }
      
      this.filteredCategories.sort((a, b) => {
        let aVal = a[key]
        let bVal = b[key]
        
        if (key === 'createdAt') {
          aVal = new Date(aVal)
          bVal = new Date(bVal)
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = bVal.toLowerCase()
        }
        
        if (this.sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
    },
    
    getSortIcon(key) {
      if (this.sortKey !== key) return 'fas fa-sort'
      return this.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'
    },
    
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    }
  }
}
</script>

<style scoped>
.category-page {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 20px;
}

.page-header {
  background: white;
  padding: 20px 30px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.page-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.breadcrumb {
  font-size: 0.9rem;
  color: #6c757d;
}

.breadcrumb-link {
  color: #007bff;
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 8px;
}

.breadcrumb-current {
  color: #6c757d;
}

.category-list-section {
  background: white;
  border-radius: 8px;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #dee2e6;
}

.section-title {
  font-size: 1.25rem;
  color: #2c3e50;
  margin: 0;
}

.add-new-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.add-new-btn:hover {
  background: #0056b3;
}

.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #dee2e6;
  background: #f8f9fa;
}

.entries-control {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #495057;
}

.entries-select {
  padding: 5px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
}

.search-control {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #495057;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  width: 200px;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.data-table th {
  background: #f8f9fa;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  position: relative;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.data-table th.sortable:hover {
  background: #e9ecef;
}

.sort-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 0.8rem;
}

.data-table td {
  padding: 15px;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
}

.data-table tr:hover {
  background: #f8f9fa;
}

.category-name {
  font-weight: 500;
  color: #2c3e50;
}

.description {
  color: #6c757d;
  max-width: 300px;
}

.action-cell {
  text-align: center;
  width: 150px; 
}

.category-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

.status-active {
  color: green;
  font-weight: bold;
}

.status-inactive {
  color: red;
  font-weight: bold;
}

.action-btn {
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 2px;
  transition: background 0.3s;
}

.edit-btn {
  background: #28a745;
  color: white;
}

.edit-btn:hover {
  background: #1e7e34;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

.pagination-info {
  font-size: 0.9rem;
  color: #495057;
}

.pagination-controls {
  display: flex;
  gap: 5px;
}

.pagination-btn {
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  background: white;
  color: #495057;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background: #e9ecef;
}

.pagination-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #dee2e6;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #495057;
}

.category-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.delete-modal {
  max-width: 400px;
}

.modal-body {
  padding: 20px;
}

.warning-text {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 10px;
}

/* Responsive */
@media (max-width: 768px) {
  .category-page {
    padding: 10px;
  }
  
  .controls-row {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 15px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
}
</style>
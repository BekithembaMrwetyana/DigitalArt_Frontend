<template>
  <div class="category-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-left">
        <button @click="goBack" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <h1 class="page-title">Category Management</h1>
        <nav class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">Home</router-link>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">Categories</span>
        </nav>
      </div>
    </div>

    <!-- Category List Section -->
    <div class="category-list-section">
      <div class="section-header">
        <h2 class="section-title">Our Categories</h2>
        <button class="add-new-btn" @click="showAddCategoryForm">
          <i class="fas fa-plus"></i> Add New Category
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading categories...</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        {{ errorMessage }}
        <button @click="loadCategories" class="retry-btn">Retry</button>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="success-message">
        <i class="fas fa-check-circle"></i>
        {{ successMessage }}
      </div>

      <!--This is where i show the Controls Row -->
      <div class="controls-row" v-if="!loading">
        <div class="entries-control">
          <span>Show</span>
          <select v-model="entriesPerPage" class="entries-select" @change="currentPage = 1">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>entries</span>
        </div>
        
        <div class="search-control">
          <span>Search:</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            class="search-input"
            placeholder="Search categories..."
            @input="filterCategories"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="table-container" v-if="!loading">
        <table class="data-table">
          <thead>
            <tr>
              <th class="sortable" @click="sortBy('categoryId')">
                ID
                <i :class="getSortIcon('categoryId')" class="sort-icon"></i>
              </th>
              <th class="sortable" @click="sortBy('name')">
                Category Name
                <i :class="getSortIcon('name')" class="sort-icon"></i>
              </th>
              <th>Description</th>
              <th class="action-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(category, index) in paginatedCategories" :key="category.categoryId">
              <td>{{ category.categoryId }}</td>
              <td class="category-name">{{ category.name }}</td>
              <td class="description">{{ category.description || '-' }}</td>
              <td class="action-cell">
                <button class="action-btn edit-btn" @click="editCategory(category)" title="Edit">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete-btn" @click="confirmDelete(category)" title="Delete">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredCategories.length === 0 && !loading" class="empty-state">
          <i class="fas fa-folder-open"></i>
          <h3>No categories found</h3>
          <p>{{ searchQuery ? 'No categories match your search.' : 'Start by adding your first category.' }}</p>
          <button v-if="!searchQuery" class="add-new-btn" @click="showAddCategoryForm">
            <i class="fas fa-plus"></i> Add Category
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination-container" v-if="filteredCategories.length > 0 && !loading">
        <div class="pagination-info">
          Showing {{ startEntry }} to {{ endEntry }} of {{ filteredCategories.length }} entries
        </div>
        <div class="pagination-controls">
          <button 
            class="pagination-btn" 
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
          >
            Previous
          </button>
          <button 
            v-for="page in visiblePages" 
            :key="page"
            :class="['pagination-btn', { active: page === currentPage }]"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button 
            class="pagination-btn" 
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showCategoryForm" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditMode ? 'Edit Category' : 'Add New Category' }}</h3>
          <button class="close-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="isEditMode ? handleUpdateCategory() : handleAddCategory()" class="category-form">
          <div class="form-group">
            <label for="categoryName">Category Name *</label>
            <input 
              id="categoryName"
              v-model="newCategory.name" 
              type="text"
              placeholder="Enter category name"
              required
              class="form-input"
              :disabled="submitting"
            />
          </div>

          <div class="form-group">
            <label for="categoryDescription">Description</label>
            <textarea 
              id="categoryDescription"
              v-model="newCategory.description" 
              placeholder="Enter category description"
              class="form-textarea"
              rows="4"
              :disabled="submitting"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal" :disabled="submitting">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting" class="loading-spinner small"></span>
              {{ isEditMode ? 'Update' : 'Add' }} Category
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
          <i class="fas fa-exclamation-triangle warning-icon"></i>
          <p>Are you sure you want to delete the category "<strong>{{ deletingCategory.name }}</strong>"?</p>
          <p class="warning-text">This action cannot be undone.</p>
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary" @click="deletingCategory = null" :disabled="submitting">
            Cancel
          </button>
          <button class="btn btn-danger" @click="handleDeleteCategory" :disabled="submitting">
            <span v-if="submitting" class="loading-spinner small"></span>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  deleteCategory,
  getAllCategories,
  saveCategory,
  updateCategory
} from "@/services/categoryService";

export default {
  name: 'CategoryManagement',
  data() {
    return {
      categories: [],
      filteredCategories: [],
      newCategory: {
        categoryId: null,
        name: '',
        description: ''
      },
      showCategoryForm: false,
      isEditMode: false,
      deletingCategory: null,
      
      // Table controls
      searchQuery: '',
      entriesPerPage: '10',
      currentPage: 1,
      sortKey: '',
      sortOrder: 'asc',
      
      // State management
      loading: false,
      submitting: false,
      errorMessage: '',
      successMessage: ''
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.filteredCategories.length / parseInt(this.entriesPerPage));
    },
    
    paginatedCategories() {
      const start = (this.currentPage - 1) * parseInt(this.entriesPerPage);
      const end = start + parseInt(this.entriesPerPage);
      return this.filteredCategories.slice(start, end);
    },
    
    visiblePages() {
      const pages = [];
      const total = this.totalPages;
      const current = this.currentPage;
      
      if (total <= 5) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        if (current <= 3) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i);
          }
        } else if (current >= total - 2) {
          for (let i = total - 4; i <= total; i++) {
            pages.push(i);
          }
        } else {
          for (let i = current - 2; i <= current + 2; i++) {
            pages.push(i);
          }
        }
      }
      
      return pages;
    },
    
    startEntry() {
      if (this.filteredCategories.length === 0) return 0;
      return (this.currentPage - 1) * parseInt(this.entriesPerPage) + 1;
    },
    
    endEntry() {
      const end = this.currentPage * parseInt(this.entriesPerPage);
      return Math.min(end, this.filteredCategories.length);
    }
  },

  mounted() {
    this.loadCategories();
  },

  methods: {
    // Navigation
    goBack() {
      this.$router.go(-1);
    },

    // Data loading
    async loadCategories() {
      this.loading = true;
      this.errorMessage = '';
      
      try {
        const response = await getAllCategories();
        this.categories = response || [];
        this.filterCategories();
        
        if (this.successMessage) {
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
        this.errorMessage = 'Failed to load categories. Please check if the server is running on http://localhost:8080';
      } finally {
        this.loading = false;
      }
    },

    // Form management
    showAddCategoryForm() {
      this.isEditMode = false;
      this.newCategory = {
        categoryId: null,
        name: '',
        description: ''
      };
      this.showCategoryForm = true;
      this.errorMessage = '';
    },

    editCategory(category) {
      this.isEditMode = true;
      this.newCategory = {
        categoryId: category.categoryId,
        name: category.name,
        description: category.description
      };
      this.showCategoryForm = true;
      this.errorMessage = '';
    },

    closeModal() {
      this.showCategoryForm = false;
      this.deletingCategory = null;
      this.errorMessage = '';
      this.newCategory = {
        categoryId: null,
        name: '',
        description: ''
      };
    },

    // CRUD operations
    async handleAddCategory() {
      if (!this.newCategory.name.trim()) {
        this.errorMessage = 'Category name is required.';
        return;
      }

      this.submitting = true;
      this.errorMessage = '';

      try {
        const categoryData = {
          name: this.newCategory.name.trim(),
          description: this.newCategory.description.trim()
        };

        await saveCategory(categoryData);
        this.successMessage = 'Category added successfully!';
        this.closeModal();
        await this.loadCategories();
      } catch (error) {
        console.error("Error adding category:", error);
        if (error.message.includes('connect') || error.message.includes('Network')) {
          this.errorMessage = 'Cannot connect to server. Please ensure the backend is running on http://localhost:8080';
        } else {
          this.errorMessage = error.message || 'Failed to add category. Please try again.';
        }
      } finally {
        this.submitting = false;
      }
    },

    async handleUpdateCategory() {
      if (!this.newCategory.name.trim()) {
        this.errorMessage = 'Category name is required.';
        return;
      }

      this.submitting = true;
      this.errorMessage = '';

      try {
        const categoryData = {
          categoryId: this.newCategory.categoryId,
          name: this.newCategory.name.trim(),
          description: this.newCategory.description.trim()
        };

        await updateCategory(categoryData);
        this.successMessage = 'Category updated successfully!';
        this.closeModal();
        await this.loadCategories();
      } catch (error) {
        console.error("Error updating category:", error);
        if (error.message.includes('connect') || error.message.includes('Network')) {
          this.errorMessage = 'Cannot connect to server. Please ensure the backend is running.';
        } else {
          this.errorMessage = error.message || 'Failed to update category. Please try again.';
        }
      } finally {
        this.submitting = false;
      }
    },

    confirmDelete(category) {
      this.deletingCategory = category;
      this.errorMessage = '';
    },

    async handleDeleteCategory() {
      if (!this.deletingCategory) return;

      this.submitting = true;
      this.errorMessage = '';

      try {
        await deleteCategory(this.deletingCategory.categoryId);
        this.successMessage = 'Category deleted successfully!';
        this.deletingCategory = null;
        await this.loadCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        if (error.message.includes('connect') || error.message.includes('Network')) {
          this.errorMessage = 'Cannot connect to server. Please ensure the backend is running.';
        } else {
          this.errorMessage = error.message || 'Failed to delete category. Please try again.';
        }
        this.deletingCategory = null;
      } finally {
        this.submitting = false;
      }
    },

    // Table functionality
    filterCategories() {
      if (!this.searchQuery.trim()) {
        this.filteredCategories = [...this.categories];
      } else {
        const query = this.searchQuery.toLowerCase();
        this.filteredCategories = this.categories.filter(category =>
          category.name.toLowerCase().includes(query) ||
          (category.description && category.description.toLowerCase().includes(query))
        );
      }
      this.currentPage = 1;
    },
    
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
      
      this.filteredCategories.sort((a, b) => {
        let aVal = a[key];
        let bVal = b[key];
        
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        
        if (this.sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    },
    
    getSortIcon(key) {
      if (this.sortKey !== key) return 'fas fa-sort';
      return this.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    },
    
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  },

  watch: {
    entriesPerPage() {
      this.currentPage = 1;
    }
  }
};
</script>

<style scoped>
.category-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header Styles */
.page-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e1e5e9;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  width: fit-content;
}

.back-button:hover {
  background: #5a6268;
}

.back-button svg {
  width: 16px;
  height: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
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
  color: #6c757d;
}

.breadcrumb-current {
  color: #495057;
  font-weight: 500;
}

/* Section Styles */
.category-list-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.add-new-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.add-new-btn:hover {
  background: #218838;
  transform: translateY(-1px);
}

/* Controls */
.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.entries-control {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #495057;
}

.entries-select {
  padding: 4px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.search-control {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #495057;
}

.search-input {
  padding: 6px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  min-width: 200px;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.data-table th {
  background: #f8f9fa;
  padding: 12px 16px;
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
  margin-left: 8px;
  font-size: 12px;
  color: #6c757d;
}

.data-table td {
  padding: 12px 16px;
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
  max-width: 300px;
  word-wrap: break-word;
  color: #6c757d;
}

.action-cell {
  width: 140px;
  text-align: center;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  margin: 0 2px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.edit-btn {
  background: #007bff;
  color: white;
}

.edit-btn:hover {
  background: #0056b3;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

/* Messages */
.loading-container {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.small {
  width: 14px;
  height: 14px;
  border-width: 1.5px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  padding: 12px 16px;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-message {
  padding: 12px 16px;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.retry-btn {
  margin-left: auto;
  padding: 4px 12px;
  background: #721c24;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #dee2e6;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #495057;
}

.empty-state p {
  margin: 0 0 20px 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #dee2e6;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #6c757d;
  padding: 4px;
}

.close-btn:hover {
  color: #495057;
}

/* Form Styles */
.category-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #495057;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-input:disabled,
.form-textarea:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

/* Delete Modal */
.delete-modal .modal-body {
  padding: 24px;
  text-align: center;
}

.warning-icon {
  font-size: 48px;
  color: #ffc107;
  margin-bottom: 16px;
}

.warning-text {
  color: #856404;
  font-size: 14px;
  margin-top: 8px;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.pagination-info {
  font-size: 14px;
  color: #6c757d;
}

.pagination-controls {
  display: flex;
  gap: 4px;
}

.pagination-btn {
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  background: white;
  color: #495057;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #e9ecef;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

/* Responsive Design */
@media (max-width: 768px) {
  .category-page {
    padding: 15px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .controls-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-control {
    justify-content: space-between;
  }
  
  .search-input {
    min-width: auto;
    flex: 1;
  }
  
  .table-container {
    font-size: 14px;
  }
  
  .data-table th,
  .data-table td {
    padding: 8px 12px;
  }
  
  .action-btn {
    padding: 4px 8px;
    font-size: 11px;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .pagination-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .action-btn {
    padding: 4px 6px;
    font-size: 10px;
  }
  
  .action-btn i {
    display: none;
  }
  
  .data-table th:first-child,
  .data-table td:first-child {
    display: none;
  }
}
.category-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header Styles */
.page-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e1e5e9;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  width: fit-content;
}

.back-button:hover {
  background: #5a6268;
}

.back-button svg {
  width: 16px;
  height: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
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
  color: #6c757d;
}

.breadcrumb-current {
  color: #495057;
  font-weight: 500;
}

/* Section Styles */
.category-list-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.add-new-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.add-new-btn:hover {
  background: #218838;
  transform: translateY(-1px);
}

/* Controls */
.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.entries-control {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #495057;
}

.entries-select {
  padding: 4px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.search-control {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #495057;
}

.search-input {
  padding: 6px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  min-width: 200px;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.data-table th {
  background: #f8f9fa;
  padding: 12px 16px;
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
  margin-left: 8px;
  font-size: 12px;
  color: #6c757d;
}

.data-table td {
  padding: 12px 16px;
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
  max-width: 300px;
  word-wrap: break-word;
  color: #6c757d;
}

.action-cell {
  width: 140px;
  text-align: center;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  margin: 0 2px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.edit-btn {
  background: #007bff;
  color: white;
}

.edit-btn:hover {
  background: #0056b3;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

/* Messages */
.loading-container {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.small {
  width: 14px;
  height: 14px;
  border-width: 1.5px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  padding: 12px 16px;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-message {
  padding: 12px 16px;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.retry-btn {
  margin-left: auto;
  padding: 4px 12px;
  background: #721c24;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #dee2e6;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #495057;
}

.empty-state p {
  margin: 0 0 20px 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #dee2e6;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #6c757d;
  padding: 4px;
}

.close-btn:hover {
  color: #495057;
}

/* Form Styles */
.category-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #495057;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-input:disabled,
.form-textarea:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

/* Delete Modal */
.delete-modal .modal-body {
  padding: 24px;
  text-align: center;
}

.warning-icon {
  font-size: 48px;
  color: #ffc107;
  margin-bottom: 16px;
}

.warning-text {
  color: #856404;
  font-size: 14px;
  margin-top: 8px;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.pagination-info {
  font-size: 14px;
  color: #6c757d;
}

.pagination-controls {
  display: flex;
  gap: 4px;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

/* Responsive Design */
@media (max-width: 768px) {
  .category-page {
    padding: 15px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .controls-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-control {
    justify-content: space-between;
  }
  
  .search-input {
    min-width: auto;
    flex: 1;
  }
  
  .table-container {
    font-size: 14px;
  }
  
  .data-table th,
  .data-table td {
    padding: 8px 12px;
  }
  
  .action-btn {
    padding: 4px 8px;
    font-size: 11px;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .pagination-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .action-btn {
    padding: 4px 6px;
    font-size: 10px;
  }
  
  .action-btn i {
    display: none;
  }
  
  .data-table th:first-child,
  .data-table td:first-child {
    display: none;
  }
} 
.pagination-btn:hover:not(:disabled) {
  background: #e9ecef;
}

.pagination-btn

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

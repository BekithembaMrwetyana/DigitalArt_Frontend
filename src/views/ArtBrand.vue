<template>
  <div class="container">
    <header>
      <h1>Art Brand Management</h1>
      <p>Add, edit, and manage art brands.</p>
    </header>

    <div class="main">
      <!-- Form Section -->
      <div class="form-section">
        <h2>{{ isEditing ? "Edit Art Brand" : "Add New Art Brand" }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Brand Name</label>
            <input v-model="brandName" type="text" placeholder="e.g. Digital Masters" required />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="description" rows="3" placeholder="A short description..." required></textarea>
          </div>

          <div class="form-group">
            <label>Creation Date</label>
            <input v-model="creationDate" type="date" required />
          </div>

          <div class="form-group">
            <label>Image URL</label>
            <input v-model="imageUrl" type="url" placeholder="https://example.com/image.jpg" required />
          </div>

          <button type="submit">{{ isEditing ? "Update Brand" : "Add Brand" }}</button>
          <button type="button" v-if="isEditing" @click="cancelEdit">Cancel</button>
        </form>
      </div>

      <!-- Preview & List Section -->
      <div class="preview-section">
        <!-- Live Preview -->
        <div class="live-preview">
          <h3>Live Preview</h3>
          <div class="preview-card">
            <img :src="imageUrl || placeholderImage" alt="Preview" />
            <h4>{{ brandName || 'Brand Name' }}</h4>
            <p>{{ description || 'Brand Description' }}</p>
            <small>{{ creationDate ? new Date(creationDate).toLocaleDateString() : 'Creation Date' }}</small>
          </div>
        </div>

        <!-- Submitted Brands List -->
        <div class="submitted-brands">
          <h3>All Brands</h3>
          <ul>
            <li v-for="brand in submittedBrands" :key="brand.brandId">
              <img :src="brand.imageUrl" alt="Brand" />
              <div>
                <p>{{ brand.brandName }}</p>
                <small>{{ new Date(brand.creationDate).toLocaleDateString() }}</small>
              </div>
              <button @click="startEdit(brand)">Edit</button>
              <button @click="deleteBrand(brand.brandId)">Delete</button>
            </li>
            <p v-if="submittedBrands.length === 0">No brands added yet.</p>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import artBrandService from "@/services/artBrandService";

export default {
  name: "ArtBrand",
  data() {
    return {
      brandName: "",
      description: "",
      creationDate: "",
      imageUrl: "",
      submittedBrands: [],
      placeholderImage: "https://via.placeholder.com/150",
      isEditing: false,
      editingId: null,
    };
  },
  created() {
    this.fetchBrands();
  },
  methods: {
    async handleSubmit() {
      try {
        const brandData = {
          brandId: this.editingId,
          brandName: this.brandName,
          description: this.description,
          creationDate: this.creationDate,
          imageUrl: this.imageUrl,
        };

        if (this.isEditing) {
          await artBrandService.update(brandData);
        } else {
          await artBrandService.create(brandData);
        }

        await this.fetchBrands();
        this.resetForm();
      } catch (error) {
        console.error("Error saving brand:", error);
        alert("Something went wrong! Check console for details.");
      }
    },

    async fetchBrands() {
      try {
        const response = await artBrandService.getAll();
        this.submittedBrands = response.data;
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    },

    async deleteBrand(brandId) {
      try {
        if (confirm("Are you sure you want to delete this brand?")) {
          await artBrandService.delete(brandId);
          await this.fetchBrands();
        }
      } catch (error) {
        console.error("Error deleting brand:", error);
      }
    },

    startEdit(brand) {
      this.isEditing = true;
      this.editingId = brand.brandId;
      this.brandName = brand.brandName;
      this.description = brand.description;
      this.creationDate = brand.creationDate;
      this.imageUrl = brand.imageUrl;
    },

    cancelEdit() {
      this.resetForm();
    },

    resetForm() {
      this.isEditing = false;
      this.editingId = null;
      this.brandName = "";
      this.description = "";
      this.creationDate = "";
      this.imageUrl = "";
    },
  },
};
</script>

<style>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

header h1 {
  margin-bottom: 5px;
}

header p {
  margin-bottom: 20px;
  color: #555;
}

.main {
  display: flex;
  gap: 40px;
}

/* Form */
.form-section {
  flex: 1;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button[type="submit"],
button[type="button"] {
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}

button[type="submit"] {
  background-color: #4f46e5;
  color: white;
}

button[type="submit"]:hover {
  background-color: #3730a3;
}

button[type="button"] {
  background-color: #a0aec0;
  color: white;
  margin-left: 10px;
}

/* Preview & List */
.preview-section {
  flex: 1;
}

.live-preview {
  margin-bottom: 20px;
}

.preview-card {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
}

.preview-card img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin-bottom: 10px;
  border-radius: 6px;
}

.submitted-brands ul {
  list-style: none;
  padding: 0;
}

.submitted-brands li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
  border: 1px solid #eee;
  padding: 5px;
  border-radius: 5px;
}

.submitted-brands li img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

.submitted-brands button {
  margin-left: 5px;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.submitted-brands button:hover {
  opacity: 0.8;
}

.submitted-brands button:nth-child(2) {
  background-color: #e53e3e; /* Delete */
  color: white;
}

.submitted-brands button:nth-child(1) {
  background-color: #4f46e5; /* Edit */
  color: white;
}
</style>

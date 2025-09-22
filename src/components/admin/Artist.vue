<template>
  <div class="container">
    <header>
      <h1>Artist Management</h1>
      <p>Add, edit, and manage artists.</p>
    </header>

    <div class="main">
      
      <div class="form-section">
        <h2>{{ isEditing ? "Edit Artist" : "Add New Artist" }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Artist Name</label>
            <input v-model="artistName" type="text" placeholder="e.g. SkynStudios" required />
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

          <button type="submit">{{ isEditing ? "Update Artist" : "Add Artist" }}</button>
          <button type="button" v-if="isEditing" @click="cancelEdit">Cancel</button>
        </form>
      </div>

     
      <div class="preview-section">
        <div class="live-preview">
          <h3>Live Preview</h3>
          <div class="preview-card">
            <img :src="imageUrl || placeholderImage" alt="Preview" />
            <h4>{{ artistName || 'Artist Name' }}</h4>
            <p>{{ description || 'Artist Description' }}</p>
            <small>{{ creationDate ? new Date(creationDate).toLocaleDateString() : 'Creation Date' }}</small>
          </div>
        </div>

        <div class="submitted-artists">
          <h3>All Artists</h3>
          <ul>
            <li v-for="artist in submittedArtists" :key="artist.artistId">
              <img :src="artist.imageUrl" alt="Artist" />
              <div>
                <p>{{ artist.artistName }}</p>
                <small>{{ new Date(artist.creationDate).toLocaleDateString() }}</small>
              </div>
              <button @click="startEdit(artist)">Edit</button>
              <button @click="deleteArtist(artist.artistId)">Delete</button>
            </li>
            <p v-if="submittedArtists.length === 0">No artists added yet.</p>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import artistService from "@/services/artistService";

export default {
  name: "Artist",
  data() {
    return {
      artistName: "",
      description: "",
      creationDate: "",
      imageUrl: "",
      submittedArtists: [],
      placeholderImage: "https://via.placeholder.com/150",
      isEditing: false,
      editingId: null,
    };
  },
  created() {
    this.fetchArtists();
  },
  methods: {
    async handleSubmit() {
      try {
        const artistData = {
          artistId: this.editingId,
          artistName: this.artistName,
          description: this.description,
          creationDate: this.creationDate,
          imageUrl: this.imageUrl,
        };

        if (this.isEditing) {
          await artistService.update(artistData);
        } else {
          await artistService.create(artistData);
        }

        await this.fetchArtists();
        this.resetForm();
      } catch (error) {
        console.error("Error saving artist:", error);
        alert("Something went wrong! Check console for details.");
      }
    },

    async fetchArtists() {
      try {
        const response = await artistService.getAll();
        this.submittedArtists = response.data;
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    },

    async deleteArtist(artistId) {
      try {
        if (confirm("Are you sure you want to delete this artist?")) {
          await artistService.delete(artistId);
          await this.fetchArtists();
        }
      } catch (error) {
        console.error("Error deleting artist:", error);
      }
    },

    startEdit(artist) {
      this.isEditing = true;
      this.editingId = artist.artistId;
      this.artistName = artist.artistName;
      this.description = artist.description;
      this.creationDate = artist.creationDate;
      this.imageUrl = artist.imageUrl;
    },

    cancelEdit() {
      this.resetForm();
    },

    resetForm() {
      this.isEditing = false;
      this.editingId = null;
      this.artistName = "";
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

.submitted-artists ul {
  list-style: none;
  padding: 0;
}

.submitted-artists li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
  border: 1px solid #eee;
  padding: 5px;
  border-radius: 5px;
}

.submitted-artists li img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

.submitted-artists button {
  margin-left: 5px;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.submitted-artists button:hover {
  opacity: 0.8;
}

.submitted-artists button:nth-child(2) {
  background-color: #e53e3e; /* Delete */
  color: white;
}

.submitted-artists button:nth-child(1) {
  background-color: #4f46e5; /* Edit */
  color: white;
}
</style>

<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <h2>My Profile</h2>
        <button v-if="!isEditing" @click="startEditing" class="edit-button">
          Edit Profile
        </button>
        <div v-else class="edit-actions">
          <button @click="saveChanges" class="save-button">Save</button>
          <button @click="cancelEditing" class="cancel-button">Cancel</button>
        </div>
      </div>

      <div class="profile-content" v-if="user">
        <div class="profile-section">
          <template v-if="!isEditing">
            <div class="profile-field">
              <label>First Name:</label>
              <span>{{ user.firstName }}</span>
            </div>
            <div class="profile-field">
              <label>Last Name:</label>
              <span>{{ user.lastName }}</span>
            </div>
            <div class="profile-field">
              <label>Email:</label>
              <span>{{ user.email }}</span>
            </div>
            <div class="profile-field">
              <label>Phone:</label>
              <span>{{ user.phone || 'Not provided' }}</span>
            </div>
          </template>

          <template v-else>
            <div class="profile-field">
              <label>First Name:</label>
              <input v-model="editedUser.firstName" type="text" required />
            </div>
            <div class="profile-field">
              <label>Last Name:</label>
              <input v-model="editedUser.lastName" type="text" required />
            </div>
            <div class="profile-field">
              <label>Email:</label>
              <input v-model="editedUser.email" type="email" required />
            </div>
            <div class="profile-field">
              <label>Phone:</label>
              <input v-model="editedUser.phone" type="tel" placeholder="Optional" />
            </div>
          </template>
        </div>

        <div class="profile-actions">
          <router-link to="/myorders" class="action-link">View My Orders</router-link>
          <router-link to="/wishlist" class="action-link">View Wishlist</router-link>
        </div>
      </div>

      <div v-else class="profile-loading">
        Loading profile...
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import userService from '@/services/UserService'

export default {
  name: 'UserProfile',
  
  setup() {
    const store = useStore()
    const router = useRouter()
    const isEditing = ref(false)
    const editedUser = ref(null)

    const user = computed(() => store.state.auth.user)

    onMounted(async () => {
      if (!user.value) {
        router.push('/login')
        return
      }
      
      try {
        // Fetch fresh user data
        const userData = await userService.readUser(user.value.userId)
        store.commit('auth/setUser', userData)
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
      }
    })

    const startEditing = () => {
      editedUser.value = { ...user.value }
      isEditing.value = true
    }

    const cancelEditing = () => {
      editedUser.value = null
      isEditing.value = false
    }

    const saveChanges = async () => {
      try {
        const updatedUser = await userService.updateUser(
          user.value.userId,
          editedUser.value
        )
        store.commit('auth/setUser', updatedUser)
        isEditing.value = false
        editedUser.value = null
      } catch (error) {
        console.error('Failed to update profile:', error)
      }
    }

    return {
      user,
      isEditing,
      editedUser,
      startEditing,
      cancelEditing,
      saveChanges
    }
  }
}
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.profile-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 600px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.profile-header h2 {
  margin: 0;
  color: #2c3e50;
}

.profile-content {
  margin-bottom: 2rem;
}

.profile-section {
  margin-bottom: 2rem;
}

.profile-field {
  display: flex;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
}

.profile-field label {
  flex: 0 0 120px;
  font-weight: bold;
  color: #666;
}

.profile-field span {
  color: #2c3e50;
}

.profile-field input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid #f0f0f0;
}

.action-link {
  padding: 0.5rem 1rem;
  color: #007BFF;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.action-link:hover {
  background-color: #f8f9fa;
  text-decoration: underline;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.edit-button {
  background-color: #007BFF;
  color: white;
}

.edit-button:hover {
  background-color: #0056b3;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
}

.save-button {
  background-color: #28a745;
  color: white;
}

.save-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.profile-loading {
  text-align: center;
  color: #666;
  padding: 2rem;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }

  .profile-field {
    flex-direction: column;
  }

  .profile-field label {
    margin-bottom: 0.5rem;
  }
}
</style>

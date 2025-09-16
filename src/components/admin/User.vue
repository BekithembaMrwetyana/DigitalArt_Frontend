<template>
  <div class="admin-dashboard">
    <div class="welcome-section">
      <h2>Welcome Admin {{ user.firstName }}</h2>
    </div>
    <div class="users-section">
      <h3>Users & Admins</h3>
      <button class="add-btn" @click="showAddUser = true">Add User/Admin</button>
      <table class="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.userId">
            <td>{{ u.firstName }} {{ u.lastName }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.role }}</td>
            <td>
              <button class="delete-btn" @click="deleteUser(u.userId)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Add User/Admin Modal -->
      <div v-if="showAddUser" class="modal-overlay">
        <div class="modal">
          <h4>Add User/Admin</h4>
          <input v-model="newUser.firstName" placeholder="First Name" />
          <input v-model="newUser.lastName" placeholder="Last Name" />
          <input v-model="newUser.email" placeholder="Email" />
          <input v-model="newUser.phoneNumber" placeholder="Phone Number" />
          <input v-model="newUser.password" type="password" placeholder="Password" />
          <select v-model="newUser.role">
            <option value="CUSTOMER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <div style="margin-top:1rem;">
            <button @click="addUser" class="save-btn">Save</button>
            <button @click="showAddUser = false" class="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import userService from "@/services/UserService.js";

export default {
  setup() {
    const store = useStore();
    const user = computed(() => store.getters["auth/user"]);
    const users = ref([]);
    const showAddUser = ref(false);
    const newUser = ref({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "CUSTOMER"
    });

    const fetchUsers = async () => {
      users.value = await userService.getAllUsers();
    };

    const addUser = async () => {
      try {
        await userService.saveUser(newUser.value);
        alert("User/Admin added!");
        showAddUser.value = false;
        newUser.value = {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          role: "CUSTOMER"
        };
        fetchUsers();
      } catch (err) {
        alert("Failed to add user/admin.");
      }
    };

    const deleteUser = async (id) => {
      if (confirm("Are you sure you want to delete this user/admin?")) {
        await userService.deleteUser(id);
        fetchUsers();
      }
    };

    onMounted(fetchUsers);

    return {
      user,
      users,
      showAddUser,
      newUser,
      addUser,
      deleteUser
    };
  }
};
</script>

<style scoped>
.admin-dashboard {
  background: white;
  border-radius: 8px;
  padding: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.welcome-section {
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px 8px 0 0;
  text-align: center;
}

.welcome-section h2 {
  margin: 0 0 10px 0;
  font-size: 2rem;
}

.welcome-section p {
  margin: 0;
  opacity: 0.9;
}

.users-section {
  margin-top: 2rem;
  background: #fff;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
}

.user-table th, .user-table td {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.add-btn, .delete-btn, .save-btn, .cancel-btn {
  padding: 0.5rem 1.2rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  margin-right: 0.5rem;
}

.add-btn {
  background: #4285f4;
  color: white;
}

.add-btn:hover {
  background: #3367d6;
}

.delete-btn {
  background: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background: #c0392b;
}

.save-btn {
  background: #007BFF;
  color: white;
}

.save-btn:hover {
  background: #0056b3;
}

.cancel-btn {
  background: #ccc;
  color: #333;
}

.cancel-btn:hover {
  background: #999;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 2rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  min-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal h4 {
  margin-bottom: 0.5rem;
  color: #3367d6;
  font-size: 1.3rem;
  text-align: center;
}

.modal input, .modal select {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-bottom: 0.3rem;
  width: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .welcome-section {
    padding: 20px;
  }
  
  .welcome-section h2 {
    font-size: 1.5rem;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .quick-actions,
  .recent-activity {
    padding: 0 20px 20px 20px;
  }
}
</style>
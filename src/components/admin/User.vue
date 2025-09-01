<template>
  <div class="user-page">
    <div class="user-card">
      <h2>User Management</h2>

      <table class="user-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.userId">
            <td>{{ user.userId }}</td>
            <td>{{ user.firstName }}</td>
            <td>{{ user.lastName }}</td>
            <td>{{ user.contact?.email }}</td>
            <td>{{ user.contact?.phoneNumber }}</td>
          </tr>
        </tbody>
      </table>

      <p v-if="users.length === 0">No users found.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "User",
  data() {
    return {
      users: [],
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get("http://localhost:8080/api/users/getAll");
        this.users = response.data || [];
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Could not load users from database.");
      }
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.user-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(to right, #6a5acd, #9370db);
}

.user-card {
  background: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 900px;
}

.user-card h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #3367d6;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.user-table th {
  background: #f4f4f4;
  font-weight: bold;
}

.user-table tr:nth-child(even) {
  background: #fafafa;
}
</style>

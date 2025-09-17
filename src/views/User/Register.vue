<template>
  <div class="home">
    <div class="main-container">
      <div class="main-content register-card">
        <h2>Register</h2>
        <form @submit.prevent="signUp">
          <input v-model="firstName" type="text" placeholder="First Name" required />
          <input v-model="lastName" type="text" placeholder="Last Name" required />
          <input v-model="email" type="email" placeholder="Email" required />
          <input v-model="phoneNumber" type="tel" placeholder="Phone Number" required />
          <input v-model="password" type="password" placeholder="Password" required />
          <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required />
          <div class="profile-row">
            <span class="label">Role:</span>
            <select v-model="role" :disabled="isEditing">
              <option value="CUSTOMER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <router-link to="/signin">Sign In</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import userService from "@/services/UserService.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const phoneNumber = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const role = ref("CUSTOMER");
    const isEditing = ref(false);
    const router = useRouter();

    const signUp = async () => {
      if (password.value !== confirmPassword.value) {
        alert("Passwords do not match");
        return;
      }

      try {
        const user = await userService.saveUser({
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          phoneNumber: phoneNumber.value,
          password: password.value,
          role: role.value
        });
        alert("Registration successful!");
        router.push("/signin");
      } catch (err) {
        const message = err.response?.data || "Registration failed";
        alert(message);
        console.error(err);
      }
    };

    return {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      role,
      isEditing,
      signUp
    };
  }
};
</script>

<style scoped>
.home {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-container {
  max-width: 400px;
  width: 100%;
}

.main-content {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.register-card input {
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.register-card select {
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.register-card button {
  margin-top: 1rem;
  padding: 0.5rem;
  background: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.register-card button:hover {
  background: #0056b3;
}
</style>

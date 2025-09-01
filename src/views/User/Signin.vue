<template>
  <div class="signin">
    <h1>Sign In</h1>
    <form @submit.prevent="signin">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Signin",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    async signin() {
      try {
        const response = await axios.post("http://localhost:8080/digital_artDB/api/users", {
          contact: { email: this.email },
          password: this.password
        });
        if (response.data) {
          alert("Welcome " + response.data.firstName + " " + response.data.lastName);
        } else {
          alert("Invalid credentials");
        }
      } catch (error) {
        alert("Error during signin");
      }
    }
  }
};
</script>

<style scoped>
.signin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #6a5acd, #9370db);
  padding: 20px;
}

.signin-card {
  background: #fff;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.signin-card h2 {
  margin-bottom: 20px;
  color: #1e3c72;
  font-weight: 700;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  transition: border 0.3s ease;
}

input:focus {
  border-color: #1e3c72;
}

.error-text {
  color: red;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  flex: 1;
}

.toggle-eye {
  position: absolute;
  right: 10px;
  cursor: pointer;
  font-size: 16px;
}

.signin-btn {
  width: 100%;
  padding: 12px;
  background: #1e90ff;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.signin-btn:hover {
  background: #005bb5;
}

.register-link {
  margin-top: 15px;
  font-size: 0.9rem;
  color: #666;
}

.register-link a {
  color: #1e90ff;
  text-decoration: none;
  font-weight: 600;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>

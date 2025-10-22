<template>
<div class="home">
<div class="main-container bg-white p-8 rounded-2xl shadow-lg mt-8 w-full max-w-lg">
<div class="main-content register-card">

<h1 class="welcome-text">Welcome to ArtSpace</h1>

<p class="text-center text-gray-600 mb-10">Register your account to get started</p>


<form @submit.prevent="signUp" class="space-y-4">

<input v-model="firstName" type="text" placeholder="First Name" required class="input-field" />

<input v-model="lastName" type="text" placeholder="Last Name" required class="input-field" />

<input v-model="email" type="email" placeholder="Email" required class="input-field" />

<input v-model="phoneNumber" type="tel" placeholder="Phone Number" required class="input-field" />
 
          <!-- Password field with toggle -->
<div class="password-wrapper">
<input

              v-model="password"

              :type="showPassword ? 'text' : 'password'"

              placeholder="Password"

              required

              class="input-field"

            />
<i class="fas fa-eye toggle-eye" @click="showPassword = !showPassword" v-if="!showPassword"></i>
<i class="fas fa-eye-slash toggle-eye" @click="showPassword = !showPassword" v-else></i>
</div>

          <!-- Confirm Password field with toggle -->
<div class="password-wrapper">
<input

              v-model="confirmPassword"

              :type="showConfirmPassword ? 'text' : 'password'"

              placeholder="Confirm Password"

              required

              class="input-field"

            />
<i class="fas fa-eye toggle-eye" @click="showConfirmPassword = !showConfirmPassword" v-if="!showConfirmPassword"></i>
<i class="fas fa-eye-slash toggle-eye" @click="showConfirmPassword = !showConfirmPassword" v-else></i>
</div>
 
          
<button type="submit">Register</button>
</form>
<div class="signup-link">
  Already have an account? <router-link to="/signin">Sign In</router-link>
</div>
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
 
    // NEW: visibility toggles

    const showPassword = ref(false);

    const showConfirmPassword = ref(false);
 
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

      showPassword,

      showConfirmPassword,

      signUp

    };

  }

};
</script>
 
<style scoped>

body {
  font-family: 'Inter', sans-serif;
}

.home {

  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  min-height: 100vh;

  display: flex;

  justify-content: center;

  align-items: center;

}
 
.main-container {

  max-width: 500px;

  width: 100%;

  min-height: 700px;

}
 
.main-content {

  background: white;

  border-radius: 15px;

  padding: 2rem;

  box-shadow: 0 8px 32px rgba(0,0,0,0.1);

}
 
.input-field {
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
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

  padding: 1rem;

  font-size: 1.2rem;

  display: block;

  margin: 0 auto;

  width: 50%;

  background: #007BFF;

  color: white;

  border: none;

  border-radius: 5px;

  cursor: pointer;

}
 
.register-card button:hover {

  background: #0056b3;

}
 
.welcome-text {
  font-size: 3rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
}



.password-wrapper {

  position: relative;

  display: flex;

  align-items: center;

}

.password-wrapper input {

  width: 100%;

  padding-right: 1.5rem; 

}
.signup-link {
 text-align: center;
 font-size: 0.9rem;
  color: #666;
}

.signup-link a {
 color: #007BFF;
  text-decoration: none;
}
.signup-link a:hover {
 text-decoration: underline;
}

.toggle-eye {

  position: absolute;

  right: 10px;

  cursor: pointer;

  user-select: none;

}
</style>
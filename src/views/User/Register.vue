

<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Register</h2>
      <form @submit.prevent="signUp">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input v-model="firstName" id="firstName" type="text" placeholder="Enter your first name" />
          <small v-if="errors.firstName" class="error-text">{{ errors.firstName }}</small>
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input v-model="lastName" id="lastName" type="text" placeholder="Enter your last name" />
          <small v-if="errors.lastName" class="error-text">{{ errors.lastName }}</small>
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input v-model="email" id="email" type="email" placeholder="Enter your email" />
          <small v-if="errors.email" class="error-text">{{ errors.email }}</small>
        </div>

        <div class="form-group">
          <label for="phoneNumber">Phone Number</label>
          <input v-model="phoneNumber" id="phoneNumber" type="tel" placeholder="Enter your phone number" />
          <small v-if="errors.phoneNumber" class="error-text">{{ errors.phoneNumber }}</small>
        </div>

        <div class="form-group password-group">
          <label for="password">Password</label>
          <div class="password-wrapper">
            <input
              v-model="password"
              id="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter password"
            />
            <span class="toggle-eye" @click="showPassword = !showPassword">
              {{ showPassword ? '🙈' : '👁️' }}
            </span>
          </div>
          <small v-if="errors.password" class="error-text">{{ errors.password }}</small>
        </div>

        <div class="form-group password-group">
          <label for="confirmPassword">Confirm Password</label>
          <div class="password-wrapper">
            <input
              v-model="confirmPassword"
              id="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm password"
            />
            <span class="toggle-eye" @click="showConfirmPassword = !showConfirmPassword">
              {{ showConfirmPassword ? '🙈' : '👁️' }}
            </span>
          </div>
          <small v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</small>
        </div>

        <button type="submit" class="register-btn">Register</button>
      </form>

      <p class="signin-link">
        Already have an account?
        <router-link :to="{ name: 'Signin' }">Sign In</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      showPassword: true,
      showConfirmPassword: true,
      errors: {}
    };
  },
  methods: {
    async signUp() {
      this.errors = {};
      let valid = true;

      if (!this.firstName.trim()) {
        this.errors.firstName = "First name is required";
        valid = false;
      }

      if (!this.lastName.trim()) {
        this.errors.lastName = "Last name is required";
        valid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.errors.email = "Enter a valid email address";
        valid = false;
      }

      const phoneRegex = /^[0-9]{8,}$/;
      if (!phoneRegex.test(this.phoneNumber)) {
        this.errors.phoneNumber = "Enter a valid phone number (at least 8 digits)";
        valid = false;
      }

      if (this.password.length < 6) {
        this.errors.password = "Password must be at least 6 characters";
        valid = false;
      }

      if (this.password !== this.confirmPassword) {
        this.errors.confirmPassword = "Passwords do not match";
        valid = false;
      }

      if (!valid) return;

      const newUser = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phoneNumber: this.phoneNumber,
        password: this.password
      };

      try {
        const response = await fetch('http://localhost:8080/digital_artDB/api/users/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newUser)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to register user');
        }

        const data = await response.json();
        console.log('User registered:', data);
        this.$router.push("/login");

      } catch (error) {
        console.error("Error registering user:", error.message);
      }
    }
  }
};
</script>


<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #6a5acd, #9370db);
  padding: 20px;
}

.register-card {
  background: #fff;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.register-card h2 {
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
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
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

.register-btn {
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

.register-btn:hover {
  background: #005bb5;
}

.signin-link {
  margin-top: 15px;
  font-size: 0.9rem;
  color: #666;
}

.signin-link a {
  color: #1e90ff;
  text-decoration: none;
  font-weight: 600;
}

.signin-link a:hover {
  text-decoration: underline;
}
</style>

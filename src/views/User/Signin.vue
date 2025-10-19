<template>
  <div class="signin-container">
    <div class="signin-card">
      <h1 class="welcome-text">Welcome to ArtSpace</h1>
      <form @submit.prevent="signin" class="signin-form">
        <input v-model="email" type="email" placeholder="Email" required class="input-field" />
        <input v-model="password" type="password" placeholder="Password" required class="input-field" />
        <button type="submit" class="signin-button">Sign In</button>
      </form>
      <div class="forgot-password">
        <a href="#" class="forgot-link">Forgot Password?</a>
      </div>
      <div class="divider">
        <span>or</span>
      </div>
      <div class="social-logins">
        <button class="social-button google">
          <img src="@/assets/images/google-icon.svg" alt="Google" class="social-icon" /> Google
        </button>
        <button class="social-button facebook">
          <img src="@/assets/images/facebook-icon.svg" alt="Facebook" class="social-icon" /> Facebook
        </button>
        <button class="social-button twitter">
          <img src="@/assets/images/twitter-icon.svg" alt="Twitter" class="social-icon" /> Twitter
        </button>
      </div>
      <div class="signup-link">
        Don’t have an account? <router-link to="/register">Register here</router-link>.
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"

export default {
  setup() {
    const email = ref("")
    const password = ref("")
    const loginRole = ref("CUSTOMER")
    const store = useStore()
    const router = useRouter()

    const signin = async () => {
      // Try login as CUSTOMER first
      let user = await store.dispatch("Auth/login", {
        email: email.value,
        password: password.value,
        role: "CUSTOMER"
      })
      if (!user || !user.userId) {
        // If not found as CUSTOMER, try as ADMIN
        user = await store.dispatch("Auth/login", {
          email: email.value,
          password: password.value,
          role: "ADMIN"
        })
      }
      if (user && user.userId) {
        if (user.role === "ADMIN") {
          alert(`Welcome Admin ${user.firstName}`)
          router.push("/admin/dashboard")
        } else {
          alert(`Login successful! Welcome ${user.firstName}`)
          router.push("/")
        }
      } else {
        alert("Invalid credentials")
      }
    }

    return { email, password, signin }
  }
}
</script>
 
<style scoped>
body {
  font-family: 'Inter', sans-serif;
}

.signin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.signin-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome-text {
  font-size: 3rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.signin-form {
  width: 100%;
  display: flex;
  flex-direction: column;
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

.signin-button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background: #007BFF;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.signin-button:hover {
  background: #0056b3;
}

.forgot-password {
  margin-top: 1rem;
  text-align: center;
}

.forgot-link {
  color: #2E86AB;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-link:hover {
  text-decoration: underline;
}

.divider {
  margin: 1.5rem 0;
  width: 100%;
  text-align: center;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e0e0e0;
}

.divider span {
  background: white;
  padding: 0 1rem;
  color: #666;
  font-size: 0.9rem;
}

.social-logins {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1.5rem;
}

.social-button {
  flex: 1;
  margin: 0 0.25rem;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.social-button:hover {
  background: #f5f5f5;
}

.social-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
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
</style>

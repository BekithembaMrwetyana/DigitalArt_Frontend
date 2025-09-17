<template>
  <div class="signin-container">
    <div class="signin-card">
      <h2>Sign In</h2>
      <form @submit.prevent="signin">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <div class="profile-row">
          <span class="label">Login as:</span>
          <select v-model="loginRole">
            <option value="CUSTOMER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <button type="submit">Sign In</button>
      </form>
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
      const user = await store.dispatch("auth/login", {
        email: email.value,
        password: password.value,
        role: loginRole.value
      })
      if (user && user.userId) {
        if (user.role === "ADMIN") {
          alert(`Welcome Admin ${user.firstName}`)
          router.push("/admin/dashboard")
        } else {
          alert(`Login successful! Welcome ${user.firstName}`)
          router.push("/dashboard")
        }
      }
    }
 
    return { email, password, loginRole, signin }
  }
}
</script>
 
<style scoped>
.signin-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.signin-card { background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); width: 300px; display: flex; flex-direction: column; }
.signin-card h2 { text-align: center; margin-bottom: 1rem; }
.signin-card input, .signin-card select { margin: 0.5rem 0; padding: 0.5rem; border-radius: 5px; border: 1px solid #ccc; }
.signin-card button { margin-top: 1rem; padding: 0.5rem; background: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer; }
.signin-card button:hover { background: #0056b3; }
.profile-row { display: flex; justify-content: space-between; align-items: center; }
.label { font-weight: bold; }
</style>
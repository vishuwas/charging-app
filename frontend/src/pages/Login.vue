<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Username:</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" required />
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <button type="submit" :disabled="loading">
        {{ loading ? "Logging in..." : "Login" }}
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      loading: false,
      error: "",
      toast: null, // Store toast instance
    };
  },
  created() {
    this.toast = useToast();
  },
  methods: {
    async handleLogin() {
      this.error = "";

      try {
        this.loading = true;

        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            username: this.username,
            password: this.password,
          }
        );

        localStorage.setItem("token", response.data.token);
        window.dispatchEvent(new Event("login"));

        this.toast.success("Logged in successfully!");

        this.$router.push("/chargers");
      } catch (err) {
        this.error = err.response?.data?.message || "Login failed.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 1rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.75rem;
}
button {
  padding: 0.5rem 1rem;
}
.error {
  color: red;
}
</style>

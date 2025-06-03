<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label>Username:</label>
        <input v-model="username" required />
      </div>
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" required />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input v-model="confirmPassword" type="password" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? "Registering..." : "Register" }}
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  name: "Register",
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      loading: false,
    };
  },
  methods: {
    async handleRegister() {
      const toast = useToast();

      if (this.username.length < 3) {
        toast.error("Username must be at least 3 characters.");
        return;
      }

      // ✅ Removed password length validation

      if (this.password !== this.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      try {
        this.loading = true;

        await axios.post("http://localhost:5000/api/auth/register", {
          username: this.username,
          password: this.password,
        });

        toast.success("Registration successful! You can now log in.");
        this.username = "";
        this.password = "";
        this.confirmPassword = "";

        this.$router.push("/login");
      } catch (err) {
        toast.error(err.response?.data?.message || "Registration failed.");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-container {
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
</style>

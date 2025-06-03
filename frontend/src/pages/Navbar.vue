<template>
  <nav class="navbar">
    <div class="left-section">
      <router-link to="/chargers">Charger List</router-link>
      <router-link to="/map">Map View</router-link>
      <router-link v-if="isLoggedIn" to="/register">Register</router-link>
      <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
    </div>

    <div class="right-section">
      <button v-if="isLoggedIn" @click="logout" class="logout-button">
        Logout
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();

const isLoggedIn = ref(
  !!localStorage.getItem("token") || !!sessionStorage.getItem("token")
);

const updateLoginStatus = () => {
  isLoggedIn.value =
    !!localStorage.getItem("token") || !!sessionStorage.getItem("token");
};

const logout = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  isLoggedIn.value = false;
  toast.success("Logged out successfully!");
  router.push("/login");
};

onMounted(() => {
  window.addEventListener("storage", updateLoginStatus);
  window.addEventListener("login", updateLoginStatus);
});
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #eee;
}

.left-section {
  display: flex;
  gap: 1rem;
}

.right-section {
  display: flex;
  justify-content: flex-end;
}

.logout-button {
  padding: 0.5rem 1rem;
}
</style>

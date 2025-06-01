<template>
  <nav class="navbar">
    <h1>⚡ Charging Station</h1>
    <button class="logout-btn" @click="logout">Logout</button>
  </nav>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function logout() {
  localStorage.removeItem("token");
  router.push("/login");
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #42b983;
  color: white;
  padding: 1rem 2rem;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.logout-btn {
  background-color: white;
  color: #42b983;
  padding: 8px 16px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #e8f5ee;
}
</style>

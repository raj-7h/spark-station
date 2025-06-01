<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="Username" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../axios";

const username = ref("");
const password = ref("");
const error = ref(null);
const router = useRouter();

const handleLogin = async () => {
  try {
    const res = await api.post("/auth/login", {
      username: username.value,
      password: password.value,
    });
    localStorage.setItem("token", res.data.token);
    router.push("/chargers");
  } catch (err) {
    error.value = err.response?.data?.message || "Login failed";
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  text-align: center;
}
input {
  display: block;
  margin: 1rem auto;
  padding: 0.5rem;
  width: 90%;
}
button {
  padding: 0.5rem 1.5rem;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>

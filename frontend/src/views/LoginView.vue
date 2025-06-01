<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>{{ isLogin ? "Login" : "Register" }}</h2>

      <form @submit.prevent="handleSubmit">
        <input v-model="username" placeholder="Username" required />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit">{{ isLogin ? "Login" : "Register" }}</button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>

      <p class="toggle-text">
        {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
        <button class="link-button" @click="isLogin = !isLogin">
          {{ isLogin ? "Register" : "Login" }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../axios";

const isLogin = ref(true);
const username = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const handleSubmit = async () => {
  try {
    const endpoint = isLogin.value ? "/auth/login" : "/auth/register";
    const res = await api.post(endpoint, {
      username: username.value,
      password: password.value,
    });

    if (isLogin.value) {
      localStorage.setItem("token", res.data.token);
      router.push("/chargers");
    } else {
      isLogin.value = true;
      alert("Registration successful. You can now log in.");
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Something went wrong";
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f6f7fb;
}

.auth-box {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px #ddd;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

input {
  display: block;
  margin: 1rem auto;
  padding: 0.5rem;
  width: 90%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 2rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.link-button {
  background: none;
  border: none;
  color: #42b983;
  font-weight: bold;
  cursor: pointer;
  margin-left: 5px;
}

.toggle-text {
  margin-top: 1rem;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>

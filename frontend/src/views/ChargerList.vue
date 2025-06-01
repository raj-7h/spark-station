<template>
  <Navbar />

  <div :class="{ 'modal-open': showAdd || editing }" class="container">
    <h2>Search</h2>

    <ChargerFilters @filter="applyFilters" />

    <button
      class="btn-primary"
      @click="showAdd = true"
      :disabled="loading"
      title="Add a new charging station"
    >
      + Add Charger
    </button>

    <div v-if="loading" class="loading">Loading chargers...</div>

    <!-- Add Charger Form Modal -->
    <div v-if="showAdd" class="modal-overlay" @click.self="showAdd = false">
      <div class="modal">
        <h3>Add Charger</h3>
        <ChargerForm @submit="addCharger" @cancel="() => (showAdd = false)" />
      </div>
    </div>

    <!-- Edit Charger Form Modal -->
    <div v-if="editing" class="modal-overlay" @click.self="editing = null">
      <div class="modal">
        <h3>Edit Charger</h3>
        <ChargerForm
          :initialData="editing"
          @submit="updateCharger"
          @cancel="() => (editing = null)"
        />
      </div>
    </div>

    <div v-if="filteredStations.length === 0 && !loading" class="empty">
      No chargers found. Try changing filters or add a new charger.
    </div>

    <div class="list" v-if="filteredStations.length > 0">
      <div v-for="station in filteredStations" :key="station._id" class="card">
        <h3>{{ station.name }}</h3>
        <p>
          Status: <strong>{{ station.status }}</strong>
        </p>
        <p>
          Power: <strong>{{ station.powerOutput }} kW</strong>
        </p>
        <p>
          Connector: <strong>{{ station.connectorType }}</strong>
        </p>
        <div class="actions">
          <button class="btn-edit" @click="edit(station)">Edit</button>
          <button class="btn-delete" @click="remove(station._id)">
            Delete
          </button>
        </div>
      </div>
    </div>

    <div v-if="filteredStations.length > 0" class="charger-map-container">
      <ChargerMap :stations="filteredStations" />
    </div>
  </div>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
import { ref, onMounted } from "vue";
import api from "../axios";
import ChargerForm from "../components/ChargerForm.vue";
import ChargerFilters from "../components/ChargerFilters.vue";
import ChargerMap from "../components/ChargerMap.vue";
import { useRouter } from "vue-router";

const stations = ref([]);
const filteredStations = ref([]);
const filters = ref({});

const showAdd = ref(false);
const editing = ref(null);
const loading = ref(false);

const router = useRouter();

async function fetchStations() {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }
  loading.value = true;
  try {
    const res = await api.get("/stations");
    stations.value = res.data;
    filteredStations.value = res.data;
  } catch (e) {
    console.error("Failed to fetch stations:", e);
    if (e.response?.status === 401) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  } finally {
    loading.value = false;
  }
}

function applyFilters(f) {
  filters.value = f;

  const hasFilters = f.status || f.connectorType || f.maxPower;
  console.log(f.maxPower);
  if (!hasFilters && f.maxPower > 0) {
    filteredStations.value = stations.value;
    return;
  }

  filteredStations.value = stations.value.filter((s) => {
    return (
      (!f.status || s.status === f.status) &&
      (!f.connectorType ||
        s.connectorType
          .toLowerCase()
          .includes(f.connectorType.toLowerCase())) &&
      (f.maxPower === undefined || s.powerOutput === f.maxPower)
    );
  });
}

async function addCharger(data) {
  await api.post("/stations", data);
  showAdd.value = false;
  await fetchStations();
}

function edit(station) {
  editing.value = { ...station };
}

async function updateCharger(data) {
  await api.put(`/stations/${data._id}`, data);
  editing.value = null;
  await fetchStations();
}

async function remove(id) {
  if (confirm("Delete this charger?")) {
    await api.delete(`/stations/${id}`);
    await fetchStations();
  }
}

onMounted(fetchStations);
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 5.5rem auto 3rem auto;
  padding: 2.5rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.modal-open .charger-map-container {
  pointer-events: none;
  user-select: none;
  filter: blur(3px);
  transition: filter 0.3s ease;
}

h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #2c3e50;
}

.list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

.card {
  background: #f5f7fa;
  padding: 1.75rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}
.card:hover {
  transform: translateY(-3px);
}

.card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.actions {
  margin-top: 1rem;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

button {
  cursor: pointer;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #1abc9c;
  color: white;
  font-size: 1rem;
  padding: 12px 24px;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  transition: background 0.3s ease;
}
.btn-primary:hover {
  background-color: #16a085;
}
button:disabled {
  background-color: #9bd5b1;
  cursor: not-allowed;
}

.btn-edit {
  background-color: #3498db;
  color: white;
}
.btn-edit:hover {
  background-color: #2a80b9;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}
.btn-delete:hover {
  background-color: #c0392b;
}

.loading {
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #666;
}

.empty {
  text-align: center;
  margin-top: 2rem;
  color: #999;
  font-style: italic;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 2rem 2.5rem;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.25s ease;
}
@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Map container spacing & style */
.charger-map-container {
  margin-top: 3rem;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}
</style>

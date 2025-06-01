<template>
  <form @submit.prevent="handleSubmit" class="form">
    <h3>{{ isEdit ? "Edit Charger" : "Add New Charger" }}</h3>

    <label>
      Name:
      <input v-model="form.name" placeholder="Charger Name" required />
    </label>

    <label>
      Latitude:
      <input
        v-model.number="form.location.latitude"
        type="number"
        step="any"
        placeholder="Latitude"
        required
      />
    </label>

    <label>
      Longitude:
      <input
        v-model.number="form.location.longitude"
        type="number"
        step="any"
        placeholder="Longitude"
        required
      />
    </label>

    <label>
      Status:
      <select v-model="form.status" required>
        <option value="" disabled>Select status</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>
    </label>

    <label>
      Power Output (kW):
      <input
        v-model.number="form.maxPower"
        type="number"
        min="0"
        placeholder="Power Output"
        required
      />
    </label>

    <label>
      Connector Type:
      <input
        v-model="form.connectorType"
        placeholder="Connector Type (e.g., CCS, Type 2)"
        required
      />
    </label>

    <div class="buttons">
      <button type="submit">{{ isEdit ? "Update" : "Add" }} Charger</button>
      <button type="button" @click="$emit('cancel')" class="btn-cancel">
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      name: "",
      location: { latitude: null, longitude: null },
      status: "",
      maxPower: null,
      connectorType: "",
    }),
  },
});

const emit = defineEmits(["submit", "cancel"]);

const form = reactive({ ...props.initialData });
const isEdit = !!props.initialData._id;

watch(
  () => props.initialData,
  (newVal) => {
    Object.assign(form, newVal);
  }
);

function handleSubmit() {
  emit("submit", { ...form });
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  color: #444;
}

input,
select {
  padding: 0.5rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  outline-offset: 2px;
  transition: border-color 0.2s;
}

input:focus,
select:focus {
  border-color: #42b983;
  box-shadow: 0 0 3px #42b983;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

button {
  cursor: pointer;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button[type="submit"] {
  background-color: #42b983;
  color: white;
}

button[type="submit"]:hover {
  background-color: #369e6f;
}

.btn-cancel {
  background-color: #ccc;
  color: #333;
}

.btn-cancel:hover {
  background-color: #aaa;
}
</style>

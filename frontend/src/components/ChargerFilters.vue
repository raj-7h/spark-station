<template>
  <div class="filters">
    <select v-model="filters.status" @change="emitFilters">
      <option value="">All Status</option>
      <option>Active</option>
      <option>Inactive</option>
    </select>

    <input
      type="number"
      v-model.number="filters.maxPower"
      placeholder="Power Output kW"
      @input="emitFilters"
    />

    <input
      v-model="filters.connectorType"
      placeholder="Connector Type"
      @input="emitFilters"
    />
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
const emit = defineEmits(["filter"]);

const filters = reactive({
  status: "",
  maxPower: Infinity,
  connectorType: "",
});

function emitFilters() {
  emit("filter", { ...filters });
}
</script>

<style scoped>
.filters {
  margin-bottom: 1rem;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>

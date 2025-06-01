<template>
  <l-map :zoom="13" :center="mapCenter" style="height: 500px; width: 100%">
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    ></l-tile-layer>

    <l-marker
      v-for="charger in chargers"
      :key="charger._id"
      :lat-lng="[charger.location.latitude, charger.location.longitude]"
      @click="selectedCharger = charger"
    ></l-marker>

    <l-popup
      v-if="selectedCharger"
      :lat-lng="[
        selectedCharger.location.latitude,
        selectedCharger.location.longitude,
      ]"
      @close="selectedCharger = null"
    >
      <div>
        <h3>{{ selectedCharger.name }}</h3>
        <p>Status: {{ selectedCharger.status }}</p>
        <p>Power: {{ selectedCharger.powerOutput }} kW</p>
        <p>Connector: {{ selectedCharger.connectorType }}</p>
      </div>
    </l-popup>
  </l-map>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import api from "../axios";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
  },
  data() {
    return {
      chargers: [],
      selectedCharger: null,
      mapCenter: [0, 0],
    };
  },
  async mounted() {
    try {
      const res = await api.get("/stations");
      this.chargers = res.data;
      if (this.chargers.length > 0) {
        this.mapCenter = [
          this.chargers[0].location.latitude,
          this.chargers[0].location.longitude,
        ];
      }
    } catch {
      alert("Failed to load chargers for map");
    }
  },
};
</script>

<style>
/* Fix Leaflet marker icon issue */
.leaflet-container {
  height: 100%;
  width: 100%;
}
</style>

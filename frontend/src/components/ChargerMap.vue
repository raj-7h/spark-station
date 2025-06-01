<template>
  <LMap :zoom="zoom" :center="center" style="height: 500px; width: 100%">
    <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />
    <LMarker
      v-for="station in stations"
      :key="station._id"
      :lat-lng="[station.location.latitude, station.location.longitude]"
    >
      <LPopup>
        <strong>{{ station.name }}</strong
        ><br />
        Status: {{ station.status }}<br />
        Power Output: {{ station.powerOutput }} kW<br />
        Connector: {{ station.connectorType }}
      </LPopup>
    </LMarker>
  </LMap>
</template>

<script setup>
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url)
    .href,
});

const props = defineProps({
  stations: {
    type: Array,
    default: () => [],
  },
});

const zoom = 12;
const center = [28.6139, 77.209]; // Adjust as needed
</script>

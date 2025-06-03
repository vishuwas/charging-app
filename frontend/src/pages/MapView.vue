<template>
  <div>
    <h2>Charging Stations Map</h2>
    <div id="map" style="height: 600px; width: 100%"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const chargers = ref([]);
const defaultLat = 28.6139;
const defaultLng = 77.209;

const fetchChargers = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/stations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    chargers.value = res.data;
  } catch (err) {
    alert("Error fetching chargers.");
  }
};

onMounted(async () => {
  await fetchChargers();

  const map = L.map("map").setView([defaultLat, defaultLng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  chargers.value.forEach((station) => {
    const marker = L.marker([
      station.location.latitude,
      station.location.longitude,
    ]).addTo(map);

    marker.bindPopup(`
      <strong>${station.name}</strong><br/>
      Status: ${station.status}<br/>
      Power: ${station.powerOutput} kW<br/>
      Connector: ${station.connectorType}
    `);
  });
});
</script>

<style>
#map {
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>

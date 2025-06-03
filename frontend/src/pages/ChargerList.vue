<template>
  <div>
    <h2>Charging Stations</h2>

    <!-- Filters -->
    <div>
      <label>Status:</label>
      <select v-model="filters.status">
        <option value="">All</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <label>Connector Type:</label>
      <input v-model="filters.connectorType" placeholder="e.g. CCS, Type2" />

      <label>Min Power (kW):</label>
      <input type="number" v-model.number="filters.minPower" />

      <label>Max Power (kW):</label>
      <input type="number" v-model.number="filters.maxPower" />

      <button @click="fetchChargers">Apply Filters</button>
    </div>

    <!-- Station List -->
    <table border="1" cellpadding="6">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Power</th>
          <th>Connector</th>
          <th>Location (Lat, Long)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="station in filteredChargers" :key="station._id">
          <td>{{ station.name }}</td>
          <td>{{ station.status }}</td>
          <td>{{ station.powerOutput }} kW</td>
          <td>{{ station.connectorType }}</td>
          <td>
            {{ station.location.latitude }}, {{ station.location.longitude }}
          </td>
          <td>
            <button @click="editStation(station)">Edit</button>
            <button @click="deleteStation(station._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add/Edit Form -->
    <h3>{{ editing ? "Edit" : "Add" }} Charging Station</h3>
    <form @submit.prevent="handleSubmit">
      <input v-model="form.name" placeholder="Name" required />
      <input
        v-model.number="form.location.latitude"
        placeholder="Latitude"
        required
      />
      <input
        v-model.number="form.location.longitude"
        placeholder="Longitude"
        required
      />
      <input
        v-model.number="form.powerOutput"
        placeholder="Power Output (kW)"
        required
      />
      <input
        v-model="form.connectorType"
        placeholder="Connector Type"
        required
      />
      <select v-model="form.status">
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <button type="submit">{{ editing ? "Update" : "Add" }}</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { ref, computed, onMounted } from "vue";

export default {
  setup() {
    const chargers = ref([]);
    const filters = ref({
      status: "",
      connectorType: "",
      minPower: 0,
      maxPower: 1000,
    });

    const form = ref({
      name: "",
      location: { latitude: 0, longitude: 0 },
      powerOutput: 0,
      connectorType: "",
      status: "Active",
    });

    const editing = ref(false);
    const editId = ref(null);

    const token = localStorage.getItem("token");

    const fetchChargers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        chargers.value = res.data;
      } catch (err) {
        alert("Error fetching chargers");
      }
    };

    const filteredChargers = computed(() => {
      return chargers.value.filter((s) => {
        const matchStatus =
          !filters.value.status || s.status === filters.value.status;
        const matchConnector =
          !filters.value.connectorType ||
          s.connectorType
            .toLowerCase()
            .includes(filters.value.connectorType.toLowerCase());
        const matchPower =
          s.powerOutput >= filters.value.minPower &&
          s.powerOutput <= filters.value.maxPower;
        return matchStatus && matchConnector && matchPower;
      });
    });

    const handleSubmit = async () => {
      try {
        if (editing.value) {
          await axios.put(
            `http://localhost:5000/api/stations/${editId.value}`,
            form.value,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } else {
          await axios.post("http://localhost:5000/api/stations", form.value, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        resetForm();
        fetchChargers();
      } catch (err) {
        alert("Error saving charger");
      }
    };

    const editStation = (station) => {
      form.value = JSON.parse(JSON.stringify(station));
      editId.value = station._id;
      editing.value = true;
    };

    const deleteStation = async (id) => {
      try {
        await axios.delete(`http://localhost:5000/api/stations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchChargers();
      } catch (err) {
        alert("Error deleting charger");
      }
    };

    const resetForm = () => {
      form.value = {
        name: "",
        location: { latitude: 0, longitude: 0 },
        powerOutput: 0,
        connectorType: "",
        status: "Active",
      };
      editing.value = false;
      editId.value = null;
    };

    onMounted(fetchChargers);

    return {
      chargers,
      filters,
      filteredChargers,
      form,
      editing,
      handleSubmit,
      editStation,
      deleteStation,
      fetchChargers,
    };
  },
};
</script>

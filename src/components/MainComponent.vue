<template>
  <BContainer class="py-4 mx-0 vh-100" :fluid="true">
    <BRow class="h-100 m-0 mx-3">
      <div class="col-6 p-0 pe-2">
        <BTable
          hover
          v-if="!loading"
          class="vehicle-table col-12 px-0 mb-0 rounded-3"
          variant="light"
          :sort-internal="true"
          :items="itemsTyped"
          :fields="fieldsTyped"
          :responsive="false"
          :multisort="true"
          :stickyHeader="true"
        >
          <template #cell(cards)="row">
            <VehicleCard
              :vehicle="row.item"
              @enterEvent="toggleEdit(row.item)"
            />
          </template>
          <template #cell(action)="row">
            <BButton variant="primary" 
            @click="toggleEdit(row.item)"
            class="m-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-pencil mb-1"
                viewBox="0 0 16 16"
                v-if="row.item.isEditing == false"
              >
                <path
                  d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-check-lg mb-1"
                viewBox="0 0 16 16"
                v-else
              >
                <path
                  d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"
                />
              </svg>
            </BButton>
            <BButton 
            variant="danger" 
            @click="toggleDelete(row.item)"
            class="m-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-trash3-fill mb-1"
                viewBox="0 0 16 16"
              >
                <path
                  d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
                />
              </svg>
            </BButton>
          </template>
        </BTable>
        <div v-else>Loading...</div>
      </div>

      <div id="map" class="col-6 rounded-3 p-0"></div>
    </BRow>
  </BContainer>
</template>

<script setup lang="ts">
import axios from "axios";
import { reactive, ref, onMounted } from "vue";
import * as L from "leaflet";
import VehicleCard from "./VehicleVard.vue";

interface Vehicle {
  id: number;
  name: string;
  model: string;
  year: number;
  color: string;
  price: number;
  latitude: number;
  longitude: number;
  isEditing: boolean;
}

const fieldsTyped: Exclude<TableFieldRaw<Vehicle>, string>[] = [
  {
    key: "cards",
    label: "Vehicle",
    sortable: false,
    class: "text-md",
  },
  {
    key: "year",
    label: "Year",
    sortable: true,
    class: "text-none",
  },
  {
    key: "price",
    label: "Price",
    sortable: true,
    class: "text-md",
  },
  {
    key: "action",
    label: "Action",
    sortable: false,
    class: "text-md",
  },
];

const itemsTyped: Vehicle[] = reactive([]);
const loading = ref(true);
const map = ref<L.Map | null>(null);

const fetchVehicles = async () => {
  try {
    const response = await axios.get("https://test.tspb.su/test-task/vehicles");
    itemsTyped.push(...response.data);
    itemsTyped.forEach((vehicle) => (vehicle.isEditing = false));
    addMarkersToMap();
  } catch (error) {
    console.error("Error fetching vehicles:", error);
  } finally {
    loading.value = false;
  }
};

const addMarkersToMap = () => {
  if (map.value) {
    itemsTyped.forEach((vehicle) => {
      L.marker([vehicle.latitude, vehicle.longitude])
        .addTo(map.value!)
        .bindPopup(`${vehicle.name} ${vehicle.model} (${vehicle.year})`)
        .openPopup();
    });
  }
};

const toggleEdit = (vehicle: Vehicle) => {
  vehicle.isEditing = !vehicle.isEditing;
};

const toggleDelete = (vehicle: Vehicle) => {
  itemsTyped.splice(itemsTyped.indexOf(vehicle), 1);
};

onMounted(() => {
  map.value = L.map("map").setView([51.505, -0.09], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map.value);

  fetchVehicles();
});
</script>

<style>
.vehicle-table {
  min-height: 100%;
}
</style>
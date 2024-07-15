<template>
    <BCard
    variant="light">
      <ul style="list-style-type: none"
      class="w-50">
        <div v-for="(value, key) in vehicle" :key="key">
          <li
          v-if="key !== 'isEditing' && key !== 'id'">
            <span>{{ key }}: </span>
            <BInput v-if="vehicle.isEditing && (key == 'model' || key == 'name' || key == 'price')" v-model="vehicle[key]"
            class="m-0 w-50"
            @keyup.enter="$emit('enterEvent')"
            ></BInput>
            <span v-else>{{ value }}</span>
          </li>
        </div>
      </ul>
    </BCard>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  const props = defineProps<{
    vehicle: {
      [key: string]: any;
      isEditing: boolean;
    };
  }>();
  </script>
  
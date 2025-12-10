<template>
  <li class="contact-block">
    <RouterLink
        :to="href"
        class="value"
    >
      {{ text }}
    </RouterLink>
  </li>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
defineProps<{ href: string; text: string }>()
</script>

<style scoped>
.contact-block {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5rem;
  font-size: 1.4rem;
  width: 100%;
  margin-top: -0.25rem;
}

.value {
  color: #ffffff;
  font-size: 1.4rem;
  text-decoration: none;
  white-space: nowrap;
  position: relative;
}

.value::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0;
  height: 2px;
  background-color: #ffffff;
  transition: width 0.3s ease;
}

.value:hover::after {
  width: 100%;
}
</style>

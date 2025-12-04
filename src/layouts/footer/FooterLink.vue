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
  flex-direction: row;   /* ➜ все на одній лінії */
  align-items: center;   /* ➜ вирівнюємо по центру */
  gap: 0.5rem;           /* ➜ відстань між "лейблом" і текстом */
  font-size: 1.4rem;
  width: 100%;
  margin-top: -0.25rem;
}

.value {
  color: #ffffff;
  font-size: 1.4rem;
  text-decoration: none;
  white-space: nowrap;   /* щоб текст не переносився */
}

.value:hover {
  color: #ffffff;
  text-decoration: none;
}
</style>

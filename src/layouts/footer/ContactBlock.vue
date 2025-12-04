<template>
  <div class="contact-block">
    <span class="label">{{ label }}:</span>
    <span class="value">
      <a v-if="link" :href="link">{{ value }}</a>
      <span v-else>{{ value }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  link?: string;
}>();
</script>

<style scoped>
.contact-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
  font-size: 1.4rem;
  width: 100%;
}

.contact-block .label {
  font-weight: bold;
  font-size: 1.2rem;
  text-align: left;
  width: 100%;
}

.contact-block .value {
  width: 100%;
  font-size: 1.4rem;
  text-align: left;
}

.contact-block .value a {
  color: #ffffff;
  text-decoration: none;
}
</style>

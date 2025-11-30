<template>
  <nav class="breadcrumbs">
    <a href="/" class="crumb">Головна</a>
    <span class="separator">/</span>
    <span class="current">{{ title }}</span>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped>
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  margin-top: 30px;
  margin-bottom: 30px;
  margin-left: 210px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.crumb {
  color: #007bff;
  text-decoration: none;
}

.separator {
  color: #666;
}

.current {
  color: #333;
  font-weight: 600;
}

@media (min-width: 2560px) {
  .breadcrumbs {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 24px;
    margin-top: 30px;
    margin-bottom: 30px;
    margin-left: 390px;
    font-family: 'Helvetica Neue', Arial, sans-serif;
  }
}
</style>
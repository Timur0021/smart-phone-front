<template>
  <nav class="breadcrumbs">
    <router-link to="/" class="crumb">Головна</router-link>

    <span class="separator">/</span>

    <template v-for="(item, index) in items" :key="index">
      <router-link
          v-if="index !== items.length - 1"
          :to="item.link"
          class="crumb"
      >
        {{ item.name }}
      </router-link>

      <span v-else class="current">
        {{ item.name }}
      </span>

      <span v-if="index !== items.length - 1" class="separator">/</span>
    </template>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  items: {
    name: string
    link: string
  }[]
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
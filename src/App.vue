<template>
  <Header v-if="!hideHeader" />
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import Header from '../src/layouts/header/Header.vue';
import {computed} from "vue";

const route = useRoute();
const hideHeader = computed(() => {
  return route.path.endsWith('/login') || route.path.endsWith('/register');
});
</script>

<style scoped>
</style>

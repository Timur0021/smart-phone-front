<template>
  <div class="page">
    <Breadcrumbs title="Бренди" />

    <h1 class="title">Бренди</h1>
    <div class="alphabet-box">
      <div v-for="char in alphabet" :key="char" class="alphabet-item">
        {{ char }}
      </div>
    </div>
    hi
  </div>
</template>

<script setup lang="ts">
import Breadcrumbs from '../views/Breadcrumbs.vue';

const alphabet = [
  'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
  '0','1','2','3','4','5','6','7','8','9',
];
</script>

<style scoped>
.page {
  padding: 20px 0;
}
.title {
  font-size: 50px;
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 20px;
  margin-left: 210px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}
.alphabet-box {
  background: #fff;
  border-radius: 50px;
  padding: 40px 40px;
  margin-top: 60px;
  margin-bottom: 40px;
  margin-left: 210px;
  max-width: 1500px;
  width: fit-content;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.alphabet-item {
  width: 40px;
  height: 40px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s;
  user-select: none;
}
.alphabet-item:hover {
  color: #fff;
  background: #1d4ed8;
}
@media (min-width: 2560px) {
  .title {
    font-size: 50px;
    font-weight: 700;
    margin-top: 10px;
    margin-bottom: 20px;
    margin-left: 390px;
    font-family: 'Helvetica Neue', Arial, sans-serif;
  }
  .alphabet-box {
    background: #fff;
    border-radius: 50px;
    padding: 40px 40px;
    margin-top: 60px;
    margin-bottom: 40px;
    margin-left: 400px;
    max-width: 1800px;
    width: fit-content;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
  .alphabet-item {
    width: 60px;
    height: 60px;
    background: #f5f5f5;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 18px;
    cursor: pointer;
    transition: 0.2s;
    user-select: none;
  }
  .alphabet-item:hover {
    color: #fff;
    background: #1d4ed8;
  }
}
</style>
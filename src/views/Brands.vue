<template>
  <div class="page">
    <Breadcrumbs title="Бренди" />

    <h1 class="title">Бренди</h1>

    <div class="alphabet-box">
      <div
          v-for="char in alphabet"
          :key="char"
          class="alphabet-item"
          @click="scrollToLetter(char)"
      >
        {{ char }}
      </div>
    </div>

    <div class="brands-container">
      <div
          v-for="(brands, char) in brandsByLetter"
          :key="char"
          :id="'letter-' + char"
          class="brands-row"
      >

        <div class="brands-letter">
          {{ char }}
        </div>

        <div class="brands-list">
          <div v-for="brand in brands" :key="brand.name" class="brand-item">
            <img :src="brand.image" :alt="brand.name" class="brand-logo" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumbs from '../views/Breadcrumbs.vue';
import { ref } from 'vue';

const alphabet = [
  'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
  '0','1','2','3','4','5','6','7','8','9',
];

const brandsByLetter: Record<string, { name: string, image: string }[]> = {
  A: [
    { name: 'Apple', image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { name: 'Asus', image: 'https://upload.wikimedia.org/wikipedia/commons/6/65/ASUS_Logo.svg' },
    { name: 'Audi', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Audi_logo_2020.png' },
  ],
  B: [
    { name: 'BMW', image: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' },
    { name: 'Bosch', image: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Bosch_logo.svg' },
    { name: 'BenQ', image: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/BenQ_logo.svg' },
  ],
  C: [
    { name: 'Canon', image: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Canon_logo.svg' },
    { name: 'Citroen', image: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Citroën_logo.svg' },
  ],
  D: [
    { name: 'Dell', image: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg' },
    { name: 'Dacia', image: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Dacia_logo.svg' },
  ],
  E: [
    { name: 'Ericsson', image: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Ericsson_logo.svg' },
    { name: 'Epson', image: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Epson_logo.svg' },
  ],
  F: [
    { name: 'Ford', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg' },
    { name: 'Fujitsu', image: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Fujitsu_logo.svg' },
  ],
  G: [
    { name: 'Google', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'GoPro', image: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/GoPro_logo.svg' },
  ],
  H: [
    { name: 'Honda', image: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Honda_logo.svg' },
    { name: 'HP', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/HP_logo_2012.svg' },
  ],
  I: [
    { name: 'IBM', image: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
    { name: 'Intel', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg' },
  ],
};


const scrollToLetter = (char: string) => {
  const el = document.getElementById('letter-' + char);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
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
  gap: 13px;
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

.brands-container {
  margin-left: 210px;
  max-width: 1500px;
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin-top: 60px;
}

.brands-row {
  display: flex;
  gap: 40px;
  align-items: center;
}

.brands-letter {
  width: 60px;
  height: 60px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.brands-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.brand-item {
  width: 220px;
  height: 140px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.2s;
}

.brand-item:hover {
  background: #1d4ed8;
}

.brand-logo {
  max-width: 200px;
  max-height: 120px;
  object-fit: contain;
  display: block;
}
@media (min-width: 2560px) {
  .title {
    margin-left: 390px;
  }
  .alphabet-box {
    margin-left: 400px;
    max-width: 1800px;
  }
  .brands-container {
    margin-left: 400px;
    max-width: 1800px;
  }
  .brands-letter {
    min-width: 80px;
    height: 80px;
    font-size: 32px;
  }
  .brand-item {
    padding: 15px 20px;
    font-size: 18px;
  }
}
</style>
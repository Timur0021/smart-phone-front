<template>
  <div class="category-slider">
    <div class="nav-card prev" @click="slidePrev" :class="{ disabled: currentIndex === 0 }">
      Назад
    </div>

    <Swiper
        @swiper="onSwiperInit"
        :slides-per-view="4"
        :space-between="14"
        class="category-swiper"
        :allow-touch-move="false"
    >
      <SwiperSlide
          v-for="(item, index) in categories"
          :key="index"
          class="category-card"
      >
        <div class="card-content">{{ item.name }}</div>
      </SwiperSlide>
    </Swiper>

    <div class="nav-card next" @click="slideNext" :class="{ disabled: currentIndex >= categories.length - 4 }">
      Далі
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

interface Category { name: string; }

const swiperInstance = ref<any>(null);
const currentIndex = ref(0);

const categories: Category[] = [
  { name: "Смартфони" },
  { name: "Ноутбуки" },
  { name: "Телевізори" },
  { name: "Планшети" },
  { name: "Гаджети" },
  { name: "Аксесуари" },
  { name: "Навушники" },
  { name: "Колонки" },
];

function onSwiperInit(swiper: any) {
  swiperInstance.value = swiper;
}

function slideNext() {
  if (swiperInstance.value && currentIndex.value < categories.length - 4) {
    currentIndex.value++;
    swiperInstance.value.slideTo(currentIndex.value, 400);
  }
}

function slidePrev() {
  if (swiperInstance.value && currentIndex.value > 0) {
    currentIndex.value--;
    swiperInstance.value.slideTo(currentIndex.value, 400);
  }
}
</script>

<style scoped>
.category-slider {
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 1700px;
  margin: 1.5rem auto 0;
}

.category-swiper {
  flex: 1;
}

.category-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px;
  text-align: center;
  border: 1px solid #e4e4e4;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 3px 6px rgba(0,0,0,0.05);
  box-sizing: border-box;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-card:hover {
  transform: translateY(-2px);
  background: #f7f7f7;
}

.card-content {
  font-size: 1.2rem;
  font-weight: 600;
}

.nav-card {
  background: #f0f0f0;
  font-weight: 700;
  color: #555;
  border-radius: 14px;
  width: 350px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
}

.nav-card.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.nav-card:hover:not(.disabled) {
  background: #dcdcdc;
}
@media (min-width: 2560px) {
  .category-slider {
    display: flex;
    align-items: center;
    gap: 14px;
    max-width: 2050px;
    margin: 1.5rem auto 0;
  }
}
</style>

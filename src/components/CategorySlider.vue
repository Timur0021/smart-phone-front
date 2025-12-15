<template>
  <div class="category-slider">
    <div class="nav-card prev" @click="slidePrev" :class="{ disabled: currentIndex === 0 }">
      <span class="arrow"></span>
    </div>

    <Swiper
        @swiper="onSwiperInit"
        :slides-per-view="4"
        :space-between="14"
        class="category-swiper"
        :allow-touch-move="false"
    >
      <SwiperSlide
          v-for="(item, index) in props.categories"
          :key="item.id"
          class="category-card"
      >
        <div class="category-image">
          <img :src="item.image" :alt="item.name" />
        </div>
        <div class="category-title">{{ item.name }}</div>
      </SwiperSlide>
    </Swiper>

    <div class="nav-card next" @click="slideNext" :class="{ disabled: currentIndex >= categories.length - 4 }">
      <span class="arrow"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

interface Category {
  id: string;
  name: string;
  slug: string;
  link: string;
  children?: Category[];
  will_be_soon?: boolean;
  image?: string;
}

const props = defineProps<{
  categories: Category[]
}>();

const swiperInstance = ref<any>(null);
const currentIndex = ref(0);

function onSwiperInit(swiper: any) {
  swiperInstance.value = swiper;
}

function slideNext() {
  if (swiperInstance.value && currentIndex.value < props.categories.length - 4) {
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

.category-card {
  flex-direction: column;
  gap: 14px;
}

.category-image {
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.category-title {
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
}

.category-card:hover {
  background: #FFFFFF;
  border: 1.95px solid #2563eb;
}

.nav-card {
  background: #1e40af;
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
  background: #2563eb;
}

.arrow {
  display: block;
  width: 20px;
  height: 20px;
  border-top: 4px solid white;
  border-right: 4px solid white;
  transform: rotate(45deg);
  transition: transform 0.3s;
}

.nav-card.prev .arrow {
  transform: rotate(-135deg);
}

.nav-card.next .arrow {
  transform: rotate(45deg);
}

@media (min-width: 2560px) {
  .category-slider {
    display: flex;
    align-items: center;
    gap: 14px;
  }
}
</style>

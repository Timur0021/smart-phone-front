<template>
  <div class="swiper-container">
    <Swiper
        :modules="[Autoplay, Navigation, Pagination]"
        :slides-per-view="1"
        :loop="true"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :pagination="{ clickable: true }"
        :navigation="false"
        class="mySwiper"
    >
      <SwiperSlide>
        <img src="../assets/1.jpg" alt="Slide 1" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="../assets/2.jpg" alt="Slide 2" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="../assets/3.jpg" alt="Slide 3" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
</script>

<style scoped>
.swiper-container {
  margin: 2rem auto 0;
  width: 100rem;
  max-width: 98%;
  border-radius: 16px;
  overflow: hidden;
}

.swiper-container img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 0;
}
::v-deep(.swiper-pagination) {
  background-color: rgba(47, 47, 47, 0.5);
  padding: 0.5rem 0;
  border-radius: 16px;
  bottom: 10px !important;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  max-width: 200px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

::v-deep(.swiper-pagination .swiper-pagination-bullet) {
  background-color: white;
  opacity: 1;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: transform 0.3s;
}

::v-deep(.swiper-pagination .swiper-pagination-bullet-active) {
  transform: scale(1.3);
}
</style>

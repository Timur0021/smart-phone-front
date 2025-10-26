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
</style>

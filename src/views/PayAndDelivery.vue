<template>
  <div class="page">
    <Breadcrumbs title="Оплата і доставка" />

    <h1 class="title">
      Оплата і доставка
    </h1>

    <div class="content">
      <div class="top">
        <div class="box">
          <h2>Способи оплати</h2>

          <p class="subtitle withIcon">
            <img src="@/assets/box.png" class="icon" alt=""/>
            Оплата при отриманні товару
          </p>

          <p>
            У відділенні "Нова Пошта" — готівковий / безготівковий розрахунок.<br>
            У поштоматі "Нова Пошта" — безготівковий розрахунок.<br>
            Кур'єром "Нова Пошта" — готівковий / безготівковий.
          </p>

          <p class="subtitle withIcon">
            <img src="@/assets/Screenshot_20260319_222700.png" class="icon" alt=""/>
            Онлайн оплата
          </p>

          <p>
            Оплата на сайті банківською карткою Visa / MasterCard
          </p>
        </div>


        <div class="box">
          <h2>Доставка Нова пошта</h2>

          <p class="subtitle withIcon">
            <img src="@/assets/images.png" class="icon" alt=""/>
            У відділення або поштомат
          </p>

          <p>
            Термін доставки 2–3 дні<br>
            Безкоштовно від 1000 грн
          </p>

          <p class="subtitle withIcon">
            <img src="@/assets/images.png" class="icon" alt=""/>
            Кур'єром
          </p>

          <p>
            Адресна доставка кур'єром Нова пошта
          </p>
        </div>
      </div>

      <div class="bottom">
        <h2>Умови обміну та повернення</h2>

        <p>
          Обмін або повернення можливий протягом 14 днів при збереженні товарного вигляду.
        </p>

        <p>
          Гроші повертаються в день повернення або до 7 днів згідно закону України.
        </p>

        <p>
          Повернення здійснюється тим самим способом оплати.
        </p>

        <p>
          Деякі товари не підлягають поверненню згідно постанови №172.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumbs from "@/views/Breadcrumbs.vue";
</script>

<style scoped>

.page {
  padding: 20px 0;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.title {
  font-size: 50px;
  font-weight: 700;
  margin-left: 210px;
  margin-bottom: 20px;
}

.content {
  max-width: 1500px;
  margin: 70px auto 0 auto;
}

.top {
  display: flex;
  gap: 20px;
}

.box {
  flex: 1;
  background: #e9f1ff;
  padding: 30px;
  border-radius: 12px;
}

.bottom {
  margin-top: 20px;
  background: #e9f1ff;
  padding: 30px;
  border-radius: 12px;
}

h2 {
  font-size: 32px;
  margin-bottom: 15px;
}

.subtitle {
  font-weight: 700;
  margin-top: 18px;
  font-size: 22px;
}

p {
  font-size: 20px;
  line-height: 1.6;
}

.withIcon {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  width: 26px;
  height: 26px;
}
@media (min-width: 2560px) {
  .content {
    max-width: 1750px;
    margin: 70px auto 0 auto;
  }
  .title {
    font-size: 50px;
    font-weight: 700;
    margin-left: 390px;
    margin-bottom: 20px;
  }
}
</style>
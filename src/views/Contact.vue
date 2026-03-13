<template>
  <div class="page">
    <Breadcrumbs title="Контакти" />

    <h1 class="title">Контакти</h1>

    <div class="content">
      <div class="left">
        <h2>Зв'яжіться з нами</h2>

        <div class="info">
          <div class="item">
            <p class="label">Телефон:</p>
            <p>+380504741854</p>
          </div>

          <div class="item">
            <p class="label">Email:</p>
            <p>info@tea.ua</p>
          </div>

          <div class="item">
            <p class="label">Фактична адреса:</p>
            <p>
              02100 Київська обл., м. Обухів,
              вул. Трипільська, 46
            </p>
          </div>

          <div class="item">
            <p class="label">Графік роботи:</p>
            <p>9:00-18:00; сб, нд-вихідні</p>
          </div>
        </div>
      </div>


      <div class="right">

        <h2>Виникли питання? Напишіть нам</h2>

        <p class="text">
          Залиште своє повідомлення, і ми відповімо якнайшвидше
        </p>

        <button class="btn">
          Написати
        </button>

        <div class="social">
          <p class="label">Соціальні мережі:</p>

          <div class="icons">
            <div class="circle">f</div>
            <div class="circle">in</div>
          </div>
        </div>
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
  margin-top: 10px;
  margin-bottom: 20px;
  margin-left: 210px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.content {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-right: 5rem;
}

.left {
  width: 650px;
  background: rgb(177, 206, 237);
  padding: 20px 60px 60px 60px;
  border-radius: 15px;
}

.left h2 {
  font-size: 50px;
  font-weight: 700;
  margin: 0 0 30px 0;
  padding: 0;
}

.label {
  font-weight: 700;
  font-size: 28px;
  margin: 0;
}

.item p:not(.label) {
  font-size: 28px;
  margin: 18px 0 0 0;
}

.item {
  margin-bottom: 35px;
}

.social {
  margin-top: 40px;
}

.icons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.right {
  width: 700px;
  background: #f7f7f7;
  padding: 60px;
  border-radius: 6px;
}

.right h2 {
  font-size: 22px;
  margin-bottom: 10px;
}

.text {
  margin-bottom: 30px;
}

.btn {
  background: #1e73ff;
  color: white;
  border: none;
  padding: 14px 24px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background: #0f5fe0;
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
  .left,
  .right {
    width: 745px;
  }
}
</style>
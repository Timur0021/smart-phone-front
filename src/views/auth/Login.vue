<template>
  <div class="page" :style="pageStyle">
    <div class="card">
      <h1 class="title">Логін</h1>

      <form @submit.prevent="submit" class="form">
        <div class="form-group">
          <input v-model="form.email" type="email" placeholder=" " />
          <label>Email</label>
        </div>

        <div class="form-group">
          <input v-model="form.password" type="password" placeholder=" " />
          <label>Пароль</label>
        </div>

        <div class="checkbox-group">
          <input v-model="form.remember_me" type="checkbox" id="policy" />
          <label for="policy">
            Запамятати мене
          </label>
        </div>

        <button type="submit" class="btn main-btn">Увійти</button>

        <p class="login-text">
          Ще не маєте облікового запису? <router-link :to="{name: 'register'}">Зареєструватись</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import type { CSSProperties } from 'vue';
import { apolloClient } from "@/graphql/apolloClient.ts";
import { LOGIN } from "@/graphql/mutations/auth/logins.ts";
import { useToast } from "vue-toastification";
import { useRouter, useRoute } from 'vue-router';

const toast = useToast();
const router = useRouter();
const route = useRoute();

const form = reactive({
  email: '',
  password: '',
  remember_me: false,
})

const backgrounds = [
  'https://images.pexels.com/photos/5077049/pexels-photo-5077049.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/5077048/pexels-photo-5077048.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/5077047/pexels-photo-5077047.jpeg?auto=compress&cs=tinysrgb&w=1920'
]

const currentBg = ref(0)

const pageStyle = computed<CSSProperties>(() => ({
  background: `url('${backgrounds[currentBg.value]}') no-repeat center/cover`,
  position: 'relative',
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: '"Inter", sans-serif',
  transition: 'background 1s ease-in-out'
}))

const submit = async () => {
  if (!form.email || !form.password) {
    toast.error("Будь ласка, заповніть усі поля!");
    return;
  }

  try {
    const { data } = await apolloClient.mutate({
      mutation: LOGIN,
      variables: {
        input: {
          email: form.email,
          password: form.password,
          remember_me: form.remember_me,
        }
      }
    });

    if (data?.login?.token) {
      toast.success("Вхід успішний!");
      localStorage.setItem("token", data.login.token);

      localStorage.setItem("remember_me", form.remember_me ? "true" : "false");
      if (form.remember_me) {
        localStorage.setItem("saved_email", form.email);
      } else {
        localStorage.removeItem("saved_email");
      }

      await router.push({
        name: 'home',
        params: { lang: route.params.lang === 'en' ? 'en' : undefined }
      });
    } else {
      toast.error("Невірні дані або проблема на сервері.");
    }
  } catch (error: any) {
    console.log(error);
    toast.error(error.message || "Помилка логіну");
  }
}

const signInWithGoogle = () => {
  console.log("Google Sign-In clicked")
}

onMounted(() => {
  const remember = localStorage.getItem("remember_me");
  if (remember === "true") {
    form.remember_me = true;

    const savedEmail = localStorage.getItem("saved_email");
    if (savedEmail) form.email = savedEmail;
  }

  setInterval(() => {
    currentBg.value = (currentBg.value + 1) % backgrounds.length
  }, 5000)
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: "Inter", sans-serif;
  overflow-x: hidden;
}

.page::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 0;
}

.card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 720px;
  backdrop-filter: blur(8px);
  padding: 50px 45px;
  border-radius: 22px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08), 0 16px 55px rgba(0, 0, 0, 0.06);
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.title {
  font-size: 32px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 35px;
  color: #fff;
  letter-spacing: -0.6px;
}

.form-group {
  position: relative;
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group input {
  width: 85%;
  max-width: 500px;
  padding: 16px 14px 12px;
  font-size: 17px;
  border: 1px solid #c7ccda;
  border-radius: 12px;
  background: #f6f7ff;
  outline: none;
  transition: 0.25s ease;
}

.form-group input:focus {
  border-color: #557cff;
  box-shadow: 0 0 0 4px rgba(85, 124, 255, 0.2);
  background: #fff;
}

.form-group label {
  position: absolute;
  left: 110px;
  top: 18px;
  font-size: 17px;
  color: #5a5a5a;
  pointer-events: none;
  transition: 0.25s ease;
}

.form-group input:focus + label,
.form-group input:not(:placeholder-shown) + label {
  top: -10px;
  font-size: 13px;
  padding: 0 6px;
  background: #fff;
  color: #415aff;
  border-radius: 4px;
  left: 110px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0 35px 90px;
  width: 85%;
  max-width: 500px;
  font-size: 16px;
  color: #fff;
  line-height: 1.45;
}

.checkbox-group input {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  appearance: none;
  background: #ffffff;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.checkbox-group input::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 7px;
  width: 6px;
  height: 12px;
  border: solid #0010ff;
  border-width: 0 4px 4px 0;
  transform: rotate(45deg) scale(0);
  opacity: 0;
  transition: all 0.25s ease;
}

.checkbox-group input:checked::after {
  transform: rotate(45deg) scale(1);
  opacity: 1;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 20px;
  cursor: pointer;
}

.checkbox-group a {
  color: inherit;
  font-weight: 600;
  text-decoration: underline;
  transition: all 0.2s ease;
}

.checkbox-group a:hover {
  color: #4285f4;
}

.btn {
  width: 85%;
  max-width: 500px;
  padding: 14px 0;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.3px;
  display: block;
  margin: 0 auto 20px;
  transition: 0.25s ease;
}

.main-btn {
  background: linear-gradient(135deg, #5a78ff, #6a8aff);
  color: white;
  box-shadow: 0 6px 20px rgba(70, 100, 255, 0.3);
}

.main-btn:hover {
  background: linear-gradient(135deg, #4d6cff, #607dff);
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(70, 100, 255, 0.35);
}

.login-text {
  text-align: center;
  color: #fff;
  font-size: 16px;
}

.login-text a {
  color: #ffffff;
  font-weight: 700;
  text-decoration: underline;
  margin-left: 5px;
}

.login-text a:hover {
  color: #4285f4;
}
</style>
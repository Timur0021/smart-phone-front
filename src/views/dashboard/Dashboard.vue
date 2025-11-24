<template>
  <div class="admin-layout">
    <!-- Лівий навбар -->
    <nav class="sidebar">
      <h2 class="sidebar-title">Головна</h2>
      <ul class="menu">
        <li class="menu-item" :class="{ active: activeItem === 'profile' }" @click="activeItem = 'profile'">
          <a href="#" class="menu-link">
            <i class="fa-solid fa-user icon"  style="color: #000000;"></i>
            Профіль
          </a>
        </li>
        <li class="menu-item" :class="{ active: activeItem === 'payments' }" @click="activeItem = 'payments'">
          <a href="#" class="menu-link">
            <span class="icon">💳</span>
            Історія оплат
          </a>
        </li>
        <li class="menu-item" :class="{ active: activeItem === 'settings' }" @click="activeItem = 'settings'">
          <a href="#" class="menu-link">
            <span class="icon">⚙️</span>
            Налаштування
          </a>
        </li>
        <li class="menu-item">
          <a href="#" class="menu-link logout" @click.prevent="handleLogout">
            <span class="icon">🚪</span>
            Вихід
          </a>
        </li>
      </ul>
    </nav>

    <div class="content">
      <div class="breadcrumb">
        <span>Головна</span>
        <span>{{ breadcrumbLabel }}</span>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { apolloClient } from "@/graphql/apolloClient.ts";
import { LOGOUT } from "@/graphql/mutations/auth/logout.ts";
import { useToast } from "vue-toastification";
import  { useRoute, useRouter } from "vue-router";

const activeItem = ref('profile');
const toast = useToast();
const router = useRouter();
const route = useRoute();

const breadcrumbLabel = computed(() => {
  switch (activeItem.value) {
    case 'profile': return 'Профіль';
    case 'payments': return 'Історія оплат';
    case 'settings': return 'Налаштування';
    default: return '';
  }
});

const handleLogout = async () => {
  try {
    await apolloClient.mutate({
      mutation: LOGOUT,
    });
  } catch (error) {
    console.warn("Logout request failed (expected if token expired):", error);
  }

  localStorage.removeItem('token');
  sessionStorage.removeItem('token');

  await apolloClient.clearStore();

  toast.success("Ви успішно вийшли з акаунту");

  await router.push({
    name: 'home',
    params: { lang: route.params.lang === 'en' ? 'en' : undefined }
  });
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  font-family: 'Inter', sans-serif;
  background-color: #ffffff;
}

.sidebar {
  width: 250px;
  background-color: #f9f9f9;
  color: #111827;
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
  box-shadow: 2px 0 5px rgba(0,0,0,0.05);
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: left;
  color: #111827;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.menu-item {
  margin-bottom: 15px;
}

.menu-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #111827;
  padding: 12px 20px;
  border-radius: 30px;
  font-weight: 500;
  transition: all 0.2s ease;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.menu-link .icon {
  margin-right: 12px;
  font-size: 1.2rem;
}

.menu-item:hover .menu-link {
  background-color: #3b82f6;
  color: #ffffff;
}

.menu-item.active .menu-link {
  background-color: #3b82f6;
  color: #ffffff;
}

.menu-link.logout {
  margin-top: auto;
  background-color: #6b7280;
  color: #ffffff;
}

.menu-link.logout:hover {
  background-color: #374151;
  transform: translateX(2px);
}

.content {
  flex-grow: 1;
  padding: 30px;
  overflow-y: auto;
  background-color: #ffffff;
}

.breadcrumb {
  margin-bottom: 20px;
  font-size: 1.1rem;
  color: #6b7280;
}
.breadcrumb span + span::before {
  content: '/';
  margin: 0 10px;
}
</style>

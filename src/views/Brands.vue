<template>
  <div class="page">
    <Breadcrumbs title="Бренди" />

    <h1 class="title">Бренди</h1>

    <div class="alphabet-box">
      <div
          v-for="char in letters"
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
import { ref, onMounted, computed } from 'vue';
import { apolloClient } from '@/graphql/apolloClient.ts';
import { GET_BRANDS } from '@/graphql/queries/brands/brands.ts';
import { useToast } from "vue-toastification";

const toast = useToast();

interface Brand {
  id: number;
  name: string;
  slug: string;
  link: string;
  image: string;
  active: boolean;
}

const letters = ref<string[]>([]);
const rawData = ref<any[]>([]);

const brandsByLetter = computed(() => {
  const map: Record<string, Brand[]> = {};

  rawData.value.forEach((row: any) => {
    map[row.letter] = row.brands;
  });

  return map;
});

const scrollToLetter = (char: string) => {
  const el = document.getElementById('letter-' + char);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

onMounted(async () => {
  try {
    const { data } = await apolloClient.query({
      query: GET_BRANDS,
      fetchPolicy: 'no-cache',
    });

    letters.value = data.brands.letters ?? [];
    rawData.value = data.brands.data ?? [];
  } catch (e: any) {
    console.error("Помилка завантаження брендів:", e);

    toast.error(
        e.message
            ? `Помилка завантаження брендів: ${e.message}`
            : "Сталася невідома помилка при завантаженні брендів"
    );
  }
});
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
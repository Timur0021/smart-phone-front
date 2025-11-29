<template>
  <div>
    <SwiperSlider :banners="banners" />
    <CategorySlider :categories="categories" />
    <section class="brand-section mt-8">
      <div class="brand-header mb-4">
        <h2 class="brand-title-header">Бренди</h2>
        <button class="text-blue-600 hover:underline">Всі бренди</button>
      </div>
      <div class="brands-row flex gap-4 overflow-x-auto">
        <div
            v-for="brand in brands"
            :key="brand.id"
            class="brand-card flex items-center justify-center bg-white rounded-lg border shadow p-4 cursor-pointer transition hover:bg-gray-100 hover:shadow-lg flex-shrink-0"
        >
          <div class="brand-image w-36 h-36 flex items-center justify-center bg-gray-50 rounded-md">
            <img :src="brand.logo" :alt="brand.name" class="object-contain w-full h-full" />
          </div>
        </div>
      </div>
    </section>
    <h1>Welcome to my website!</h1>
  </div>
</template>

<script setup lang="ts">
import SwiperSlider from "@/components/SwiperSlider.vue";
import CategorySlider from "@/components/CategorySlider.vue";
import { ref, onMounted } from "vue";
import { apolloClient } from "@/graphql/apolloClient.ts";
import { GET_PAGE } from "@/graphql/queries/page/page.ts";
import { GET_SETTINGS } from "@/graphql/queries/settings/settings.ts";

const banners = ref<any[]>([])
const categories = ref<Category[]>([]);

interface Category {
  id: string;
  name: string;
  slug: string;
  link: string;
  children?: Category[];
  will_be_soon?: boolean;
  image?: string;
}

interface Brand {
  id: number;
  name: string;
  logo: string;
}

const brands = ref<Brand[]>([
  { id: 1, name: "Brand 1", logo: "https://picsum.photos/400/400?random=1" },
  { id: 2, name: "Brand 2", logo: "https://picsum.photos/400/400?random=2" },
  { id: 3, name: "Brand 3", logo: "https://picsum.photos/400/400?random=3" },
  { id: 4, name: "Brand 4", logo: "https://picsum.photos/400/400?random=4" },
  { id: 5, name: "Brand 5", logo: "https://picsum.photos/400/400?random=5" },
  { id: 6, name: "Brand 6", logo: "https://picsum.photos/400/400?random=6" },
]);

onMounted(async () => {
  try {
    const { data: pageData } = await apolloClient.query({
      query: GET_PAGE,
      variables: { slug: "golovna" },
    }) as any;

    const blocks = pageData.page.blocks;
    const mainBanner = blocks.find((b: any) => b.type === "main_banner");
    const items = mainBanner.block[0].data.find((d: any) => d.key === "items");

    banners.value = items.items.map((banner: any) => {
      const obj: any = {};
      banner.data.forEach((item: any) => (obj[item.key] = item.value));

      return obj;
    });
  } catch (error) {
    console.error("Помилка завантаження бенерів:", error);
  }

  try {
    const { data: settingsData } = await apolloClient.query({
      query: GET_SETTINGS,
      fetchPolicy: 'no-cache'
    }) as any;

    const categoriesData = settingsData?.settings?.product_categories || [];

    categories.value = categoriesData.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image: cat.image || '',
      link: `/${cat.slug}`,
      will_be_soon: cat.will_be_soon || false,
      children: (cat.children || []).map((child: any) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        link: `/${cat.slug}/${child.slug}`,
        will_be_soon: child.will_be_soon || false,
        image: child.image ?? null
      })),
    }));
  } catch (error) {
    console.error("Помилка завантаження категорій:", error);
  }
});
</script>

<style scoped>
.brand-section {
  margin-top: 60px;
}
.brand-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 200px;
  margin-right: 200px;
}

.brand-title-header {
  font-size: 3rem;
  font-weight: 700;
}

.brand-header button {
  font-size: 1.25rem;
  padding: 1.30rem 1.30rem;
  background-color: #1d4ed8;
  color: white;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  min-width: 180px;
}

.brand-header button:hover {
  background-color: #2563eb;
}

.brands-row {
  display: flex;
  gap: 20px;
  flex-wrap: nowrap;
  justify-content: center;
  padding-bottom: 8px;
}

.brand-card {
  flex: 0 0 auto;
  width: 265px;
  height: 265px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  border: 1px solid #e4e4e4;
  box-shadow: 0 3px 6px rgba(0,0,0,0.05);
}

.brand-card:hover {
  background: #2563eb;
}

.brand-image {
  width: 144px;
  height: 144px;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.brand-image img {
  max-width: 100%;
  max-height: 100%;
}

@media (min-width: 2560px) {
  .brand-section {
    margin-top: 60px;
  }
  .brand-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 380px;
    margin-right: 380px;
  }
  .brand-title-header {
    font-size: 3rem;
    font-weight: 700;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #1d4ed8;
  }

  .brand-header button {
    font-size: 1.25rem;
    padding: 1.30rem 1.30rem;
    background-color: #1d4ed8;
    color: white;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    min-width: 180px;
    transition: background-color 0.3s ease;
  }

  .brand-header button:hover {
    background-color: #2563eb;
  }

  .brands-row {
    display: flex;
    gap: 25px;
    flex-wrap: nowrap;
    justify-content: center;
    padding-bottom: 8px;
  }

  .brand-card {
    flex: 0 0 auto;
    width: 320px;
    height: 260px;
    background: white;
    border-radius: 12px;
    border: 1px solid #e4e4e4;
    box-shadow: 0 3px 6px rgba(0,0,0,0.05);
  }

  .brand-card:hover {
    background: #2563eb;
  }

  .brand-image {
    width: 144px;
    height: 144px;
    background: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
  }

  .brand-image img {
    max-width: 110%;
    max-height: 110%;
  }
}
</style>


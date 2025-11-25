<template>
  <div>
    <SwiperSlider :banners="banners" />
    <CategorySlider :categories="categories" />
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
interface Category {
  id: string;
  name: string;
  slug: string;
  link: string;
  children?: Category[];
  will_be_soon?: boolean;
  image?: string;
}

const categories = ref<Category[]>([]);

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

<style scoped></style>

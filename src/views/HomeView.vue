<template>
  <div>
    <SwiperSlider :banners="banners" />
    <CategorySlider/>
    <h1>Welcome to my website!</h1>
  </div>
</template>

<script setup lang="ts">
import SwiperSlider from "@/components/SwiperSlider.vue";
import CategorySlider from "@/components/CategorySlider.vue";
import { ref, onMounted } from "vue";
import { apolloClient } from "@/graphql/apolloClient.ts";
import { GET_PAGE } from "@/graphql/queries/page/page.ts";

const banners = ref<any[]>([])

onMounted(async () => {
  const { data } = await apolloClient.query({
    query: GET_PAGE,
    variables: { slug: "golovna" }
  }) as any;

  const blocks = data.page.blocks;
  const mainBanner = blocks.find((b: any) => b.type === "main_banner");
  const items = mainBanner.block[0].data.find((d: any) => d.key === "items");

  banners.value = items.items.map((banner: any) => {
    const obj: any = {};

    banner.data.forEach((item: any) => {
      obj[item.key] = item.value;
    })

    return obj;
  });
});
</script>

<style scoped></style>

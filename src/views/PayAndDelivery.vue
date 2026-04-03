<template>
  <div class="page" v-if="page">
    <Breadcrumbs
        :items="[
          { name: 'Оплата та доставка', link: '/oplata-ta-dostavka' }
        ]"
    />

    <h1 class="title">{{ page.title }}</h1>

    <div class="content">
      <div class="top" v-if="topBlocks.length">
        <div class="box" v-for="(block, index) in topBlocks" :key="index">
          <h2 v-if="block.title">{{ block.title }}</h2>

          <div v-for="item in block.items" :key="item.title">
            <p class="subtitle withIcon" v-if="item.title">
              <img :src="item.image" class="icon" alt="" />
              {{ item.title }}
            </p>
            <p v-html="item.description"></p>
            <p v-if="item.sub_title" class="subtitle">{{ item.sub_title }}</p>
          </div>
        </div>
      </div>

      <div class="bottom" v-if="bottomBlock">
        <h2>{{ bottomBlock.title }}</h2>
        <div v-for="paragraph in bottomBlock.paragraphs" :key="paragraph" v-html="paragraph"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Breadcrumbs from "@/views/Breadcrumbs.vue";
import { apolloClient } from "@/graphql/apolloClient.ts";
import { GET_PAGE } from "@/graphql/queries/page/page.ts";
import { useToast } from "vue-toastification";

const page = ref<any>(null);
const topBlocks = ref<any[]>([]);
const bottomBlock = ref<any>(null);

const slug = "oplata-ta-dostavka";

function parsePayAndDeliveryBlock(block: any) {
  return block.block
      .filter((b: any) => b.type === "pay_and_delivery")
      .flatMap((b: any) => {
        return b.data[0].items.map((list: any) => {
          const titleItem = list.data.find((d: any) => d.key === "title");
          const itemsData = list.data.find((d: any) => d.key === "items");
          const items = itemsData.items.map((i: any) => {
            const data = Object.fromEntries(i.data.map((d: any) => [d.key, d.value]));
            return data;
          });
          return {
            title: titleItem?.value,
            items
          };
        });
      });
}

function parseDescriptionEditor(block: any) {
  const descBlock = block.block.find((b: any) => b.type === "description_editor");
  if (!descBlock) return null;

  const description = descBlock.data.find((d: any) => d.key === "description_editor")?.value;
  const paragraphs = description.split("</p>").map((p: string) => p.replace("<p>", "").trim()).filter(Boolean);
  return {
    title: "Умови обміну та повернення",
    paragraphs
  };
}

onMounted(async () => {
  try {
    const { data } = await apolloClient.query({
      query: GET_PAGE,
      variables: { slug }
    });
    page.value = data.page;
    topBlocks.value = parsePayAndDeliveryBlock(page.value.blocks[0]);
    bottomBlock.value = parseDescriptionEditor(page.value.blocks[0]);
  } catch (err) {
    useToast().error("Помилка завантаження сторінки");
    console.error(err);
  }
});
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
<template>
  <div class="product-page">
    <Breadcrumbs
        :items="[
          { name: 'Товари', link: '/products' },
          { name: product.title, link: `/products/${product.slug}` }
        ]"
    />

    <div class="container">
      <div class="product">
        <div class="gallery">
          <div class="thumbnails">
            <div
                v-for="(img, index) in product.images"
                :key="index"
                class="thumb"
                :class="{ active: img === activeImage }"
                @click="setImage(img)"
            >
              <img :src="img" />
            </div>
          </div>

          <div class="main-image">
            <img :src="activeImage" alt="product" />
          </div>
        </div>

        <div class="info">
          <h1 class="title">{{ product.title }}</h1>

          <div class="price-block">
            <div class="prices">
              <span class="current">₴ {{ product.price }}</span>

              <span class="old" v-if="product.oldPrice">
                ₴ {{ product.oldPrice }}
              </span>
            </div>

            <div class="discount" v-if="product.oldPrice">
              -{{ discountPercent(product.price, product.oldPrice) }}%
            </div>
          </div>

          <p class="description">
            {{ product.description }}
          </p>

          <button class="buy-btn">Купити</button>
        </div>
      </div>

      <div class="tabs">
        <div class="tab-headers">
          <button
              :class="{ active: activeTab === 'chars' }"
              @click="activeTab = 'chars'"
          >
            Характеристики
          </button>

          <button
              :class="{ active: activeTab === 'reviews' }"
              @click="activeTab = 'reviews'"
          >
            Відгуки
          </button>
        </div>

        <div class="tab-content" :class="{ 'tab-content--plain': activeTab === 'reviews' }">
          <div v-if="activeTab === 'chars'">
            <table class="chars">
              <tr
                  v-for="(item, index) in product.characteristics"
                  :key="index"
              >
                <td>{{ item.name }}</td>
                <td>{{ item.value }}</td>
              </tr>
            </table>
          </div>

          <div v-if="activeTab === 'reviews'">
            <div
                class="review"
                v-for="(review, index) in paginatedReviews"
                :key="index"
            >
              <div class="review-avatar">
                <img :src="review.avatar" alt="avatar" />
              </div>

              <div class="review-body">
                <div class="review-header">
                  <div class="review-name">
                    {{ review.name }} {{ review.surname }}
                  </div>

                  <div class="review-rating">
                    <span
                        v-for="(star, i) in getStars(review.rating)"
                        :key="i"
                        class="star"
                    >
                      ★
                    </span>
                  </div>
                </div>

                <p class="review-text">
                  {{ review.text }}
                </p>
              </div>
            </div>
            <div class="pagination">
              <button @click="prevPage" :disabled="currentPage === 1">
                ← Назад
              </button>

              <span>
                {{ currentPage }} / {{ totalPages }}
              </span>

              <button @click="nextPage" :disabled="currentPage === totalPages">
                Вперед →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Breadcrumbs from "@/views/Breadcrumbs.vue";

const product = ref({
  title: "iPhone 15 Pro Max 256GB",
  slug: "iphone-15-pro-max-256gb",
  price: 58999,
  oldPrice: 69999,
  description:
      "Новий iPhone з титановим корпусом, потужним процесором та топовою камерою.",
  images: [
    "https://picsum.photos/id/1015/1200/800",
    "https://picsum.photos/id/1016/1200/800",
    "https://picsum.photos/id/1018/1200/800",
    "https://picsum.photos/id/1020/1200/800",
    "https://picsum.photos/id/1024/1200/800",
    "https://picsum.photos/id/1027/1200/800",
    "https://picsum.photos/id/1035/1200/800"
  ],
  characteristics: [
    { name: "Бренд", value: "Apple" },
    { name: "Памʼять", value: "256 GB" },
    { name: "Колір", value: "Titanium Black" },
    { name: "Екран", value: "6.7 OLED" },
  ],
  reviews: [
    {
      name: "Іван",
      surname: "Петренко",
      rating: 5,
      text: "Дуже крутий товар 🔥",
      avatar: "https://i.pravatar.cc/100?img=12"
    },
    {
      name: "Олена",
      surname: "Коваль",
      rating: 4,
      text: "Камера просто топ! Я був приємно здивований якістю фото навіть у складних умовах освітлення. Знімки виходять дуже чіткі, з правильними кольорами та чудовою деталізацією. Особливо сподобалось, як працює нічний режим — фотографії виглядають так, ніби зроблені професійною камерою. Відео також на високому рівні: стабілізація працює ідеально, немає тряски навіть під час руху. В цілому, це один із найкращих смартфонів, які я використовував, і камера тут реально одна з головних причин для покупки.",
      avatar: "https://i.pravatar.cc/100?img=32"
    },
    {
      name: "Андрій",
      surname: "Мельник",
      rating: 5,
      text: "Телефон перевершив усі очікування. Дуже швидкий, нічого не зависає навіть при великому навантаженні. Камера реально топ — користуюсь кожного дня і завжди отримую класні фото. Батарея тримає довго, що для мене дуже важливо. Однозначно рекомендую!",
      avatar: "https://i.pravatar.cc/100?img=21"
    },
    {
      name: "Марія",
      surname: "Шевченко",
      rating: 5,
      text: "Дуже стильний дизайн і приємно лежить у руці. Екран яскравий і плавний, користуватись одне задоволення. Особливо подобається якість відео — знімаю блоги і різниця з попереднім телефоном колосальна.",
      avatar: "https://i.pravatar.cc/100?img=45"
    },
    {
      name: "Олександр",
      surname: "Кравець",
      rating: 4,
      text: "Загалом дуже хороший смартфон. Потужний процесор, швидка робота системи, якісні матеріали. Єдине — ціна трохи висока, але воно того варте.",
      avatar: "https://i.pravatar.cc/100?img=33"
    },
    {
      name: "Ірина",
      surname: "Ткаченко",
      rating: 5,
      text: "Користуюсь вже місяць і дуже задоволена. Особливо подобається камера — фото виходять як з професійної камери. Також сподобалась автономність, заряд тримає цілий день без проблем.",
      avatar: "https://i.pravatar.cc/100?img=28"
    },
    {
      name: "Дмитро",
      surname: "Сидоренко",
      rating: 4,
      text: "Дуже швидкий телефон, все працює без лагів. Ігри йдуть ідеально. Камера хороша, але очікував трохи більшого нічного режиму. В цілому задоволений покупкою.",
      avatar: "https://i.pravatar.cc/100?img=14"
    },
    {
      name: "Наталія",
      surname: "Гончар",
      rating: 5,
      text: "Це найкращий телефон, який у мене був. Дуже гарний дисплей, плавна анімація, зручний інтерфейс. Камера — просто космос, особливо портретний режим.",
      avatar: "https://i.pravatar.cc/100?img=47"
    },
    {
      name: "Віталій",
      surname: "Бондаренко",
      rating: 4,
      text: "Хороший апарат для роботи і розваг. Використовую для фото, відео та роботи — справляється з усім. Трохи дорогий, але якість відповідає ціні.",
      avatar: "https://i.pravatar.cc/100?img=19"
    },
    {
      name: "Світлана",
      surname: "Клименко",
      rating: 5,
      text: "Дуже задоволена покупкою. Камера, швидкість, дизайн — все на найвищому рівні. Особливо сподобалась стабілізація відео — знімаю дітей і все виходить дуже плавно.",
      avatar: "https://i.pravatar.cc/100?img=50"
    }
  ],
});

const activeImage = ref(product.value.images[0]);

const setImage = (img: string) => {
  activeImage.value = img;
};

const getStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => i < rating);
};

const currentPage = ref(1);
const perPage = 5;

const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return product.value.reviews.slice(start, start + perPage);
});

const totalPages = computed(() => {
  return Math.ceil(product.value.reviews.length / perPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

onMounted(() => {
  setInterval(() => {
    const currentIndex = product.value.images.indexOf(activeImage.value);
    const nextIndex =
        (currentIndex + 1) % product.value.images.length;
    activeImage.value = product.value.images[nextIndex];
  }, 3000);
});

const activeTab = ref<"chars" | "reviews">("chars");

const discountPercent = (price: number, oldPrice: number) => {
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};
</script>

<style scoped>
.product-page {
  padding: 20px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

@media (min-width: 1800px) {
  .container {
    max-width: 1600px;
  }
}

@media (min-width: 2200px) {
  .container {
    max-width: 1800px;
  }
}

.product {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 50px;
  align-items: start;
}

.gallery {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-left: 4rem;
}

.thumbnails {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 650px;
  overflow-y: auto;
  scrollbar-width: thin;
  height: calc(6 * 100px + 3 * 14px);
}

.thumbnails::-webkit-scrollbar {
  width: 6px;
}

.thumbnails::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.main-image {
  width: 80%;
  height: 650px;
  border-radius: 16px;
  overflow: hidden;
  background: #f5f5f5;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb {
  width: 150px;
  height: 150px;
  cursor: pointer;
  opacity: 0.6;
  border-radius: 10px;
  overflow: hidden;
  transition: 0.2s;
  flex: 0 0 auto;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb:hover {
  opacity: 1;
}

.thumb.active {
  opacity: 1;
  border: 2px solid #000;
}

.info {
  width: 100%;
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 50px;
  margin-bottom: 40px;
  font-weight: 700;
}

.price-block {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.prices {
  display: flex;
  align-items: center;
  gap: 12px;
}

.current {
  font-size: 36px;
  font-weight: bold;
  color: #e60023;
}

.old {
  font-size: 26px;
  text-decoration: line-through;
  color: #888;
}

.discount {
  background: #e60023;
  color: #fff;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 24px;
  font-weight: bold;
}

.description {
  margin-bottom: 20px;
  color: #555;
}

.buy-btn {
  padding: 12px 20px;
  background: black;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 6px;
}

.tabs {
  margin-top: 40px;
  margin-left: 60px;
}

.tab-headers {
  display: inline-flex;
  padding: 10px;
  border-radius: 16px;
  background: #f1f3f5;
  gap: 12px;
  box-shadow: inset 0 0 0 1px #e5e7eb;
}

.tab-headers button {
  position: relative;
  padding: 14px 28px;
  min-width: 180px;
  border: none;
  cursor: pointer;
  background: transparent;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.25s ease;
  text-align: center;
}

.tab-headers button:hover {
  color: #111;
  background: rgba(255, 255, 255, 0.8);
}

.tab-headers button.active {
  background: #ffffff;
  color: #111;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.10);
}

.tab-headers button.active::after {
  content: "";
  position: absolute;
  left: 25%;
  right: 25%;
  bottom: 8px;
  height: 3px;
  background: #000;
  border-radius: 2px;
}

.tab-content {
  margin-top: 20px;
  padding: 20px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
}

.tab-content--plain {
  background: transparent;
  box-shadow: none;
  padding: 0;
}

.chars {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;
}

.chars tr {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
}

.chars td {
  padding: 24px 30px;
  font-size: 20px;
  border: none;
}

.chars td:first-child {
  font-weight: 600;
  color: #555;
  width: 40%;
}

.chars td:last-child {
  font-weight: 700;
  color: #111;
}

.review {
  display: flex;
  gap: 30px;
  background: #ffffff;
  border-radius: 22px;
  padding: 50px;
  margin-bottom: 30px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
  transition: 0.25s ease;
}

.review:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
}

.review-avatar img {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
}

.review-body {
  flex: 1;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.review-name {
  font-size: 24px;
  font-weight: 700;
  color: #111;
}

.review-rating {
  display: flex;
  gap: 6px;
}

.star {
  color: #f5b301;
  font-size: 26px;
}

.review-text {
  margin: 0;
  color: #444;
  font-size: 20px;
  line-height: 1.8;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  margin-top: 40px;
}

.pagination button {
  padding: 12px 22px;
  border-radius: 10px;
  border: none;
  background: #2563EB;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: 0.2s;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 18px;
  font-weight: 600;
}
@media (min-width: 2560px) {
  .gallery {
    margin-left: 2rem
  }

  .thumbnails {
    display: flex;
    gap: 14px;
    margin-top: 18px;
    overflow-x: auto;
  }

  .thumb {
    width: 150px;
    height: 95px;
    cursor: pointer;
    opacity: 0.6;
    border-radius: 10px;
    overflow: hidden;
    transition: 0.2s;
    flex: 0 0 auto;
  }

  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .tabs {
    margin-top: 40px;
    margin-left: 40px;
  }
}
</style>
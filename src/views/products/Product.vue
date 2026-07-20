<template>
  <div v-if="loading" class="page-loader">
    <div class="loader"></div>
  </div>

  <div v-else class="product-page">
    <Breadcrumbs
        :items="[
          { name: 'Товари', link: '/products' },
          { name: product.name, link: `/products/${product.slug}` }
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
              <img :src="img" alt="Фото"/>
            </div>
          </div>

          <div class="main-image">
            <img :src="activeImage" alt="product"/>
          </div>
        </div>

        <div class="info">
          <div class="product-meta">
            <div class="product-code">
              Код: {{ product.code }}
            </div>

            <div class="availability" v-if="product.in_stock">
              <span class="dot"></span>
              <span>В наявності</span>
            </div>
          </div>

          <h1 class="title">{{ product.name }}</h1>

          <div class="divider"></div>

          <div class="price-block">
            <div class="quantity">
              <button class="qty-btn" @click="decrease">−</button>

              <input
                  class="qty-value"
                  type="number"
                  v-model.number="quantity"
                  min="1"
              />

              <button class="qty-btn" @click="increase">+</button>
            </div>

            <div class="prices">
              <span class="old" v-if="product.old_price">
                {{ product.old_price }} ₴
              </span>

              <span class="current">{{ product.price }} ₴</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="actions">
            <div class="left-actions">
              <button class="buy-btn primary">В кошик</button>
              <button class="buy-btn secondary">Усі товари бренду</button>
              <button class="buy-btn info" @click="openReviewModal">Залишити відгук</button>
            </div>

            <button v-if="isAuthenticated" class="favorite-btn" @click="toggleFavorite">
                <span>
                  {{ product.is_favorite ? '❤️' : '♡' }}
                </span>
            </button>
          </div>
        </div>
      </div>

      <div class="description-box">
        <h2 class="description-title">Опис</h2>

        <div class="description" v-html="product.description"></div>
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
                <img  :src="review.avatar || 'https://ui-avatars.com/api/?name=User&background=random'" alt="avatar"/>
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
                        :class="star"
                    >
                      ★
                    </span>
                  </div>
                </div>

                <p class="review-text">
                  {{ review.content }}
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
  <div v-if="showReviewModal" class="modal-overlay" @click.self="closeReviewModal">
    <div class="modal">
      <button class="modal-close" @click="closeReviewModal">✕</button>

      <h2>Залишити відгук</h2>

      <div class="form-row">
        <div class="form-group">
          <input
              v-model="reviewForm.name"
              placeholder="Ім'я"
          />
        </div>

        <div class="form-group">
          <input
              v-model="reviewForm.surname"
              placeholder="Прізвище"
          />
        </div>
      </div>

      <div class="form-group">
        <StarRatings
            v-model="reviewForm.rating"
            :numberOfStars="5"
            :starSize="50"
            :step="0.5"
            starColor="#f5a623"
            inactiveColor="#ccc"
        />
      </div>

      <div class="form-group">
        <textarea
            v-model="reviewForm.text"
            placeholder="Коментар..."
            rows="5"
        ></textarea>
      </div>

      <div class="modal-actions">
        <button @click="closeReviewModal">Скасувати</button>
        <button class="submit" @click="submitReview">
          Відправити
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed, watch} from "vue";
import StarRatings from "vue3-star-ratings";
import Breadcrumbs from "@/views/Breadcrumbs.vue";
import { useRoute } from "vue-router";
import { apolloClient } from "@/graphql/apolloClient";
import { GET_PRODUCT } from "@/graphql/queries/products/product";
import { GET_WISHLIST_STATUS } from "@/graphql/queries/products/wishlistProductIds.ts";
import { ADD_WISHLIST } from "@/graphql/mutations/products/addWishlist.ts";
import { DELETE_WISHLIST } from "@/graphql/mutations/products/deleteWishlist.ts";
import { CREATE_PRODUCT_FEEDBACK } from "@/graphql/mutations/products/productFeedback";
import { GET_PRODUCT_FEEDBACKS } from "@/graphql/queries/products/productFeedbacks.ts";
import { useToast } from "vue-toastification";


const toast = useToast();
const route = useRoute();

const product = ref<any>({
  images: [],
  reviews: [],
  characteristics: [],
  is_favorite: false,
});
const activeImage = ref('');
const loading = ref(true);

const loadProductFeedbacks = async () => {
  try {
    const { data } = await apolloClient.query({
      query: GET_PRODUCT_FEEDBACKS,
      variables: {
        id: product.value.id,
        page: currentPage.value,
        limit: 10,
      },
      fetchPolicy: "network-only",
    });
    console.log(data);
    product.value.reviews = data?.productFeedbacks?.data ?? []
  } catch (e: any) {
    console.error(e);
  }
}

const loadProduct = async () => {
  try {
    loading.value = true;

    const { data } = await apolloClient.query({
      query: GET_PRODUCT,
      variables: {
        slug: route.params.slug
      },
      errorPolicy: 'all'
    });

    product.value = {
      ...data?.product,
      is_favorite: false,
    };

    await loadWishlistStatus();
    await loadProductFeedbacks();

    if (product.value.images?.length) {
      activeImage.value = product.value.images[0];
    }
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

const loadWishlistStatus = async () => {
  const token = localStorage.getItem('token');

  if (!token || !product.value?.id) {
    return;
  }

  const { data } = await apolloClient.query({
    query: GET_WISHLIST_STATUS,
    variables: {
      ids: [product.value.id]
    },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    fetchPolicy: 'network-only',
  });

  const wishlistIds = data?.wishlistProducts ?? [];

  product.value.is_favorite = wishlistIds.includes(product.value.id);
};

onMounted(async () => {
  await loadProduct();
});

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('token');
});

const showReviewModal = ref(false);
const reviewForm = ref({
  name: "",
  surname: "",
  rating: 0,
  text: ""
});

const openReviewModal = () => {
  showReviewModal.value = true;
};

const closeReviewModal = () => {
  showReviewModal.value = false;
};

const submitReview = async () => {
  if (!reviewForm.value.name.trim()) {
    toast.error("Please enter your name");
    return;
  }

  if (!reviewForm.value.rating) {
    toast.error("Please select a rating");
    return;
  }

  try {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_PRODUCT_FEEDBACK,
      variables: {
        name: reviewForm.value.name,
        surname: reviewForm.value.surname,
        content: reviewForm.value.text,
        product_id: product.value.id,
        rating: Math.round(reviewForm.value.rating * 2) / 2,
      },
    });

    if (data?.createProductFeedback?.status) {
      toast.success(
          data.createProductFeedback.message ?? "Відгук успішно додано"
      );

      reviewForm.value = {
        name: "",
        surname: "",
        rating: 0,
        text: "",
      };

      closeReviewModal();

      await loadProduct();
    }
  } catch (e: any) {
    toast.error(e.message ?? "Помилка при відправці відгуку");
    console.log(e);
  }
};

const setImage = (img: string) => {
  activeImage.value = img;
};

const getStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => {
    const starNumber = i + 1;

    if (rating >= starNumber) {
      return "full";
    }

    if (rating >= starNumber - 0.5) {
      return "half";
    }

    return "empty";
  });
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

const quantity = ref(1);

const increase = () => {
  quantity.value++;
};

const decrease = () => {
  if (quantity.value > 1) quantity.value--;
};

watch(quantity, (val) => {
  if (!val || val < 1) {
    quantity.value = 1;
  }
});

const activeTab = ref<"chars" | "reviews">("chars");

const toggleFavorite = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return;
  }

  try {
    const mutation = product.value.is_favorite
        ? DELETE_WISHLIST
        : ADD_WISHLIST;

    const { data } = await apolloClient.mutate({
      mutation,
      variables: {
        id: product.value.id,
      },
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const response = product.value.is_favorite
        ? data?.deleteWishList
        : data?.addWishList;

    if (response?.status) {
      product.value.is_favorite = !product.value.is_favorite;
    }
  } catch (e) {
    console.error(e);
  }
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

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  font-size: 18px;
  color: #555;
}

.product-code {
  font-weight: 600;
  font-size: 18px;
}

.availability {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 18px;
  color: #16a34a;
}

.dot {
  width: 20px;
  height: 20px;
  background: #16a34a;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 0 2px #16a34a;
}

.dot::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -58%);
  font-size: 14px;
  color: white;
  font-weight: 900;
  line-height: 1;
}

.title {
  font-size: 50px;
  margin-bottom: 40px;
  font-weight: 700;
}

.divider {
  height: 1px;
  background: #e5e7eb;
  margin: 20px 0;
}

.price-block {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 40px;
  margin-bottom: 15px;
}

.quantity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.qty-btn {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: #fff;
  font-size: 26px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.qty-value {
  width: 50px;
  height: 50px;
  text-align: center;
  outline: none;
  appearance: textfield;
  border-radius: 50%;
  border: 1px solid #ddd;
  font-size: 24px;
  font-weight: 700;
  background: #fff;
}

.qty-value::-webkit-outer-spin-button,
.qty-value::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.prices {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.current {
  font-size: 36px;
  font-weight: bold;
  color: #000000;
}

.old {
  font-size: 24px;
  text-decoration: line-through;
  color: #888;
  position: relative;
  top: -2px;
}

.description {
  margin-bottom: 20px;
  color: #555;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.left-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.buy-btn {
  flex: 1;
  flex-shrink: 0;
  padding: 16px 26px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}


.buy-btn.primary {
  background: #2563eb;
  color: #fff;
}

.buy-btn.primary:hover {
  background: #1e40af;
}

.buy-btn.secondary {
  background: #f97316;
  color: #fff;
}

.buy-btn.secondary:hover {
  background: #ea580c;
}

.buy-btn.info {
  background: #14b8a6;
  color: #fff;
}

.buy-btn.info:hover {
  background: #0f766e;
}

.favorite-btn {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.favorite-btn:hover {
  background: #fef2f2;
  border-color: #fca5a5;
  transform: scale(1.05);
}

.favorite-btn span {
  font-size: 30px;
  line-height: 1;
}

.favorite-btn span.active {
  color: #ef4444;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.description-box {
  max-width: 1400px;
  margin: 80px auto 0 auto;
  padding: 25px 30px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.description-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #111;
}

.description-box .description {
  margin: 0;
  color: #555;
  font-size: 20px;
  line-height: 1.8;
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

.star.empty {
  color: #d1d5db;
}

.star.full {
  color: #f5b301;
}

.star.half {
  background: linear-gradient(
      90deg,
      #f5b301 50%,
      #d1d5db 50%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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

.page-loader {
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,.9);
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.loader {
  width: 70px;
  height: 70px;
  border: 6px solid #dbeafe;
  border-top: 6px solid #2563eb;
  border-radius: 50%;
  animation: spin .8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

  .description-box {
    max-width: 1700px;
    margin: 80px auto 0 auto;
    padding: 25px 30px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  }

  .tabs {
    margin-top: 40px;
    margin-left: 40px;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .modal {
    width: 600px;
    transform: translateX(40px);
    background: #fff;
    border-radius: 16px;
    padding: 30px 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    position: relative;
  }

  .modal-close {
    position: absolute;
    top: 12px;
    right: 12px;

    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: transparent;
    font-size: 20px;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-close:hover {
    background: #f3f4f6;
  }

  .modal h2 {
    font-size: 40px;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .form-row {
    display: flex;
    gap: 12px;
    margin-bottom: 15px;
  }

  .form-row .form-group {
    flex: 1;
    margin-bottom: 0;
  }

  textarea {
    resize: vertical;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #ddd;
    font-size: 16px;
    box-sizing: border-box;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }

  .modal-actions button {
    padding: 14px 22px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    min-width: 140px;
    transition: 0.2s;
  }

  .modal-actions button:first-child {
    background: #e5e7eb;
    color: #111;
  }

  .modal-actions button:first-child:hover {
    background: #d1d5db;
  }

  .submit {
    background: #2563eb;
    color: white;
  }

  .submit:hover {
    background: #1d4ed8;
  }
}
</style>
<template>
  <section class="products-page">
    <nav class="breadcrumbs">
      <router-link to="/" class="crumb">Головна</router-link>
      <span class="separator">/</span>
      <span>Товари</span>
    </nav>

    <div class="layout">
      <aside class="filters">
        <h3 class="filters-title">Фільтри</h3>

        <div class="filter-block">
          <div class="filter-header" @click="toggleBlock('categories')">
            <h4>Категорії</h4>
            <span class="arrow" :class="{ open: openBlocks.categories }"></span>
          </div>

          <div v-show="openBlocks.categories">
            <label v-for="cat in visibleCategories" :key="cat.id" class="checkbox">
              <input type="checkbox" v-model="selected.categories" :value="cat.id" />
              <span>{{ cat.name }}</span>
            </label>

            <div
                v-if="categories.length > 3"
                class="show-more"
                @click.stop="toggleShowAll('categories')"
            >
              {{ showAll.categories ? 'Сховати' : 'Показати ще' }}
            </div>
          </div>
        </div>

        <div class="filter-block">
          <div class="filter-header" @click="toggleBlock('brands')">
            <h4>Бренди</h4>
            <span class="arrow" :class="{ open: openBlocks.brands }"></span>
          </div>

          <div v-show="openBlocks.brands">
            <label v-for="brand in visibleBrands" :key="brand.id" class="checkbox">
              <input type="checkbox" v-model="selected.brands" :value="brand.id" />
              <span>{{ brand.name }}</span>
            </label>

            <div
                v-if="brands.length > 3"
                class="show-more"
                @click.stop="toggleShowAll('brands')"
            >
              {{ showAll.brands ? 'Сховати' : 'Показати ще' }}
            </div>
          </div>
        </div>

        <div class="filter-block">
          <div class="filter-header" @click="toggleBlock('values')">
            <h4>Значення</h4>
            <span class="arrow" :class="{ open: openBlocks.values }"></span>
          </div>

          <div v-show="openBlocks.values">
            <label v-for="val in visibleValues" :key="val.id" class="checkbox">
              <input type="checkbox" v-model="selected.values" :value="val.id" />
              <span>{{ val.name }}</span>
            </label>

            <div
                v-if="values.length > 3"
                class="show-more"
                @click.stop="toggleShowAll('values')"
            >
              {{ showAll.values ? 'Сховати' : 'Показати ще' }}
            </div>
          </div>
        </div>
      </aside>

      <div class="products">
        <div class="products-header">
          <div class="sort">
            <select v-model="sortBy" class="sort-select">
              <option value="popular">За популярністю</option>
              <option value="price_asc">Ціна: зростання</option>
              <option value="price_desc">Ціна: спадання</option>
              <option value="new">Новинки</option>
            </select>
          </div>

          <div class="count">
            {{ filteredProducts.length }} товарів
          </div>
        </div>
        <div class="grid">
          <div v-for="product in paginatedProducts" :key="product.id" class="card">
            <div
                class="favorite"
                @click="toggleFavorite(product)"
            >
              <span v-if="product.isFavorite">❤️</span>
              <span v-else>🤍</span>
            </div>

            <img :src="product.image" class="image" />

            <div class="reviews">
              ⭐ {{ product.reviews_count }} відгуків
            </div>

            <router-link
                :to="`/product/${product.slug}`"
                class="title"
            >
              {{ product.title }}
            </router-link>

            <div class="prices">
              <div>
                <div class="new-price">{{ product.price }} грн</div>
                <div v-if="product.old_price" class="old-price">
                  {{ product.old_price }} грн
                </div>
              </div>

              <button class="buy-btn">Купити</button>
            </div>
          </div>
        </div>

        <div class="pagination">
          <button
              class="page-btn"
              :disabled="currentPage === 1"
              @click="currentPage--"
          >
            ‹
          </button>
          <button
              v-for="pageNumber in pageNumbers"
              :key="pageNumber + ''"
              @click="typeof pageNumber === 'number' && (currentPage = pageNumber)"
              :disabled="pageNumber === '...'"
              :class="[
                'page-btn',
                { active: pageNumber === currentPage, disabled: pageNumber === '...' }
              ]"
          >
            {{ pageNumber }}
          </button>
          <button
              class="page-btn"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const sortBy = ref('popular')

const categories = ref([
  { id: 1, name: 'Телефони' },
  { id: 2, name: 'Ноутбуки' },
  { id: 3, name: 'Планшети' },
  { id: 4, name: 'Аксесуари' }
])

const brands = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Samsung' },
  { id: 3, name: 'Xiaomi' },
  { id: 4, name: 'Huawei' }
])

const values = ref([
  { id: 1, name: '128GB' },
  { id: 2, name: '256GB' },
  { id: 3, name: '512GB' },
  { id: 4, name: '1TB' }
])

const selected = ref({
  categories: [],
  brands: [],
  values: []
})

const openBlocks = ref({
  categories: true,
  brands: true,
  values: true
})

const toggleFavorite = (product: any) => {
  product.isFavorite = !product.isFavorite
}

const toggleBlock = (key: 'categories' | 'brands' | 'values') => {
  openBlocks.value[key] = !openBlocks.value[key]
}

const showAll = ref({
  categories: false,
  brands: false,
  values: false
})

const toggleShowAll = (key: 'categories' | 'brands' | 'values') => {
  showAll.value[key] = !showAll.value[key]
}

const visibleCategories = computed(() =>
    showAll.value.categories ? categories.value : categories.value.slice(0, 3)
)

const visibleBrands = computed(() =>
    showAll.value.brands ? brands.value : brands.value.slice(0, 3)
)

const visibleValues = computed(() =>
    showAll.value.values ? values.value : values.value.slice(0, 3)
)
const phoneImages = [
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
  'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
  'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400',
  'https://images.unsplash.com/photo-1603898037225-1c9c9d6f5c3d?w=400'
]
const products = ref(
    Array.from({ length: 55 }, (_, i) => ({
      id: i + 1,
      title: `Товар ${i + 1}`,
      slug: `product-${i + 1}`,
      price: 1000 + i * 10,
      old_price: i % 2 ? 1200 + i * 10 : null,
      reviews_count: i,
      image: phoneImages[i % phoneImages.length],
      isFavorite: false
    }))
)

const currentPage = ref(1)
const perPage = 9

const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | string)[] = []

  pages.push(1)

  if (current > 3) {
    pages.push('...')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push('...')
  }

  pages.push(total)

  return pages
})

const filteredProducts = computed(() => {
  let list = [...products.value]

  if (selected.value.categories.length) {
    list = list.filter(p =>
        selected.value.categories.includes(p.id % 4 + 1)
    )
  }

  if (selected.value.brands.length) {
    list = list.filter(p =>
        selected.value.brands.includes(p.id % 4 + 1)
    )
  }

  if (selected.value.values.length) {
    list = list.filter(p =>
        selected.value.values.includes(p.id % 4 + 1)
    )
  }

  switch (sortBy.value) {
    case 'price_asc':
      list.sort((a, b) => a.price - b.price)
      break

    case 'price_desc':
      list.sort((a, b) => b.price - a.price)
      break

    case 'new':
      list.sort((a, b) => b.id - a.id)
      break

    case 'popular':
    default:
      list.sort((a, b) => b.reviews_count - a.reviews_count)
      break
  }

  return list
})

const totalPages = computed(() =>
    Math.ceil(filteredProducts.value.length / perPage)
)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredProducts.value.slice(start, start + perPage)
})
</script>

<style scoped>
.products-page {
  max-width: 90rem;
  margin: 0 auto;
  padding: 32px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 30px;
  color: #888;
  margin-bottom: 16px;
}

.crumb {
  color: #007bff;
  text-decoration: none;
}

.layout {
  display: flex;
  gap: 30px;
}

.filters {
  width: 420px;
}

.filters-title {
  font-size: 34px;
  margin-bottom: 18px;
}

.filter-block {
  background: #fff;
  border-radius: 28px;
  padding: 28px;
  border: 1px solid #eee;
  box-shadow: 0 4px 15px rgba(0,0,0,0.04);
  margin-bottom: 20px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.filter-block h4 {
  font-size: 34px;
  margin: 0 0 24px 0;
}

.arrow {
  width: 14px;
  height: 14px;
  border-right: 4px solid #333;
  border-bottom: 4px solid #333;
  display: inline-block;
  transform: rotate(45deg);
  transition: 0.25s ease;
  margin-right: 4px;
}

.arrow.open {
  transform: rotate(-135deg);
  border-color: #007bff;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 18px;
  font-size: 28px;
}

.checkbox input {
  transform: scale(1.4);
}

.show-more {
  margin-top: 10px;
  font-size: 24px;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}

.products {
  flex: 1;
  margin-top: 6rem;
}

.products-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.sort-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  width: 480px;
  height: 60px;

  border: 1px solid #e5e7eb;
  border-radius: 22px;

  padding: 0 60px 0 22px;

  font-size: 26px;
  font-weight: 600;

  color: #111;
  background-color: #fff;

  cursor: pointer;

  transition: all 0.25s ease;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 20 20'%3E%3Cpath fill='%23555' d='M5.5 7.5l4.5 5 4.5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 20px center;
  background-size: 26px;
}

.sort-select:hover {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.12);
}

.sort-select option {
  font-size: 26px;
  padding: 10px;
}

.count {
  font-size: 40px;
  font-weight: 700;
  color: #555;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 15px;
  box-shadow: 0 6px 25px rgba(0,0,0,0.06);
  height: 520px;
  position: relative;
}

.image {
  width: 100%;
  height: 330px;
  object-fit: cover;
  border-radius: 12px;
}

.reviews {
  margin-top: 14px;
  font-size: 22px;
  font-weight: 500;
  color: #6b7280;
}

.favorite {
  position: absolute;
  top: 12px;
  right: 12px;

  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #fff;
  border-radius: 50%;
  border: 1.5px solid #e5e7eb;

  font-size: 22px;
  cursor: pointer;

  transition: all 0.25s ease;
}

.favorite:hover {
  transform: scale(1.1);
  border-color: #ff4d4f;
}

.favorite span {
  transition: transform 0.2s ease;
}

.favorite:active span {
  transform: scale(1.2);
}

.title {
  display: block;

  margin-top: 18px;

  font-size: 30px;
  font-weight: 800;

  line-height: 1.2;

  color: #111;
  text-decoration: none;

  transition: color 0.2s ease;
}

.title:hover {
  color: #007bff;
}

.prices {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  margin-top: 18px;
}

.prices > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.new-price {
  font-size: 30px;
  font-weight: 800;
  color: #111;
  line-height: 1;
  margin-bottom: 10px;
}

.old-price {
  font-size: 20px;
  font-weight: 500;
  color: #9ca3af;

  text-decoration: line-through;
  text-decoration-thickness: 2px;
  text-decoration-color: #9ca3af;

  transform: none;
}

.buy-btn {
  padding: 14px 22px;
  font-size: 24px;
  font-weight: 700;

  color: #fff;
  background: #007bff;

  border: none;
  border-radius: 14px;

  cursor: pointer;
  transition: all 0.2s ease;

  white-space: nowrap;
}

.buy-btn:hover {
  background: #0257b0;
  transform: translateY(-1px);
}

.pagination {
  margin-top: 30px;
  display: flex;
  gap: 8px;
}

.page-btn {
  min-width: 56px;
  height: 56px;

  padding: 0 16px;

  border-radius: 12px;
  background: #eee;
  border: none;

  font-size: 20px;
  font-weight: 600;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}

.page-btn.active {
  background: #007bff;
  color: white;
}
.page-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.page-btn.disabled {
  background: transparent;
  cursor: default;
}
@media (min-width: 2560px) {
  .products-page {
    max-width: 130rem;
    margin: 0 auto;
    padding: 32px 32px;
  }

  .sort-select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    width: 480px;
    height: 60px;

    border: 1px solid #e5e7eb;
    border-radius: 22px;

    padding: 0 60px 0 22px;

    font-size: 26px;
    font-weight: 600;

    color: #111;
    background-color: #fff;

    cursor: pointer;

    transition: all 0.25s ease;

    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 20 20'%3E%3Cpath fill='%23555' d='M5.5 7.5l4.5 5 4.5-5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 20px center;
    background-size: 26px;
  }

  .sort-select:hover {
    border-color: #007bff;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.12);
  }

  .sort-select option {
    font-size: 26px;
    padding: 10px;
  }

  .count {
    font-size: 40px;
    font-weight: 700;
    color: #555;
  }
}
</style>
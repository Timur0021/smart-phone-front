<template>
  <section class="products-page">
    <div v-if="loading" class="page-loader">
      <div class="spinner"></div>
    </div>

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
            <div v-for="cat in visibleCategories" :key="cat.id">
              <div class="category-parent">
                <label class="checkbox">
                  <input
                      type="checkbox"
                      v-model="selected.categories"
                      :value="cat.id"
                      @click.stop
                  />
                  <span>{{ cat.name }}</span>
                </label>

                <span
                    v-if="cat.children?.length"
                    class="category-arrow"
                    :class="{ open: openedCategories[cat.id] }"
                    @click.stop="toggleCategory(cat.id)"
                ></span>
              </div>

              <div
                  v-if="cat.children?.length"
                  v-show="openedCategories[cat.id]"
              >
                <label
                    v-for="child in cat.children"
                    :key="child.id"
                    class="checkbox category-child"
                >
                  <input
                      type="checkbox"
                      v-model="selected.categories"
                      :value="child.id"
                  />
                  <span>{{ child.name }}</span>
                </label>
              </div>
            </div>

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

        <div
            v-for="characteristic in characteristics"
            :key="characteristic.id"
            class="filter-block"
        >
          <div
              class="filter-header"
              @click="toggleCharacteristic(characteristic.id)"
          >
            <h4>{{ characteristic.name }}</h4>

            <span
                class="arrow"
                :class="{ open: openedCharacteristics[characteristic.id] }"
            ></span>
          </div>

          <div v-show="openedCharacteristics[characteristic.id]">
            <label
                v-for="value in characteristic.values"
                :key="value.id"
                class="checkbox"
            >
              <input
                  type="checkbox"
                  v-model="selected.values"
                  :value="value.id"
              />

              <span>{{ value.name }}</span>

              <span
                  v-if="characteristic.name.toLowerCase() === 'колір'"
                  class="color-dot"
                  :style="{ backgroundColor: getColor(value.name) }"
              ></span>
            </label>
          </div>
        </div>
      </aside>

      <div class="products">
        <div class="products-header">
          <div class="sort">
            <select v-model="sortBy" class="sort-select">
              <option value="POPULAR">За популярністю</option>
              <option value="LOWER_PRICE">Ціна: зростання</option>
              <option value="HIGH_PRICE">Ціна: спадання</option>
              <option value="NEW">Новинки</option>
            </select>
          </div>

          <div class="count">
            {{ pagination.total }} товарів
          </div>
        </div>
        <div class="grid">
          <div v-for="product in products_data" :key="product.id" class="card">
            <div
                v-if="isAuthenticated"
                class="favorite"
                @click="toggleFavorite(product)"
            >
              <span v-if="product.is_favorite">❤️</span>
              <span v-else>🤍</span>
            </div>

            <img :src="product.image" class="image"  alt="image"/>

            <div class="reviews">
              ⭐ {{ product.views_count ?? 0 }} переглядів
            </div>

            <router-link
                :to="`/product/${product.slug}`"
                class="title"
            >
              {{ product.name }}
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
              :disabled="currentPage === pagination.lastPage"
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
import { onMounted, ref, computed, watch } from 'vue'
import { apolloClient } from "@/graphql/apolloClient.ts";
import { GET_PRODUCTS} from "@/graphql/queries/products/products.ts";
import { GET_WISHLIST_STATUS } from "@/graphql/queries/products/wishlistProductIds.ts";
import { ADD_WISHLIST } from "@/graphql/mutations/products/addWishlist.ts";
import { DELETE_WISHLIST } from "@/graphql/mutations/products/deleteWishlist.ts";
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const getColor = (name: string) => {
  const map: Record<string, string> = {
    чорний: 'black',
    білий: 'white',
    червоний: 'red',
    зелений: 'green',
    синій: 'blue',
    сірий: 'gray',
    золотий: 'gold',
  }

  return map[name.toLowerCase()] || name.toLowerCase()
}

const sortBy = ref('POPULAR')
const openedCategories = ref<Record<number, boolean>>({})
const openedCharacteristics = ref<Record<number, boolean>>({})

const products_data = ref<any[]>([])
const categories = ref([])
const brands = ref([])
const characteristics = ref([])
const currentPage = ref(1)

const categoryInitialized = ref(false)
const activeCategorySlug = computed(() => {
  return selected.value.categories.length
      ? null
      : categorySlug.value
})

const selected = ref<{
  categories: number[]
  brands: number[]
  values: number[]
}>({
  categories: [],
  brands: [],
  values: []
})

const pagination = ref({
  currentPage: 1,
  lastPage: 1,
  total: 0,
})

const categorySlug = computed(() => {
  return route.query.category || null
})

const filters = computed(() => {
  const result = []

  if (selected.value.categories.length) {
    result.push({
      type: 'categories',
      ids: selected.value.categories
    })
  }

  if (selected.value.brands.length) {
    result.push({
      type: 'brands',
      ids: selected.value.brands
    })
  }

  if (selected.value.values.length) {
    result.push({
      type: 'values',
      ids: selected.value.values
    })
  }

  return result
})

const loadWishlistStatus = async () => {
  const token = localStorage.getItem('token')

  if (!token || !products_data.value.length) {
    return
  }

  const ids = products_data.value.map(product => product.id)

  const { data } = await apolloClient.query({
    query: GET_WISHLIST_STATUS,
    variables: {
      ids
    },
    context: {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
    fetchPolicy: 'network-only',
  })

  const wishlistIds = data?.wishlistProducts ?? []

  products_data.value = products_data.value.map(product => ({
    ...product,
    is_favorite: wishlistIds.includes(product.id)
  }))
}

const loadProducts = async () => {
  loading.value = true

  try {
    console.log(filters.value)
    const { data } = await apolloClient.query({
      query: GET_PRODUCTS,
      variables: {
        page: currentPage.value,
        limit: 9,
        category_slug: activeCategorySlug.value,
        filters: filters.value,
        sort_by: sortBy.value,
      },
      fetchPolicy: 'network-only',
    })

    products_data.value = data?.products.data
    await loadWishlistStatus()
    pagination.value = data?.products.pagination

    categories.value = data?.products.filters.categories
    brands.value = data?.products.filters.brands
    characteristics.value = data?.products.filters.characteristics

    if (
        categorySlug.value &&
        !categoryInitialized.value
    ) {
      categories.value.forEach((cat: any) => {

        if (cat.slug === categorySlug.value) {
          selected.value.categories = [cat.id]
          openedCategories.value[cat.id] = true
        }

        cat.children?.forEach((child: any) => {
          if (child.slug === categorySlug.value) {
            selected.value.categories = [child.id]
            openedCategories.value[cat.id] = true
          }
        })
      })

      categoryInitialized.value = true
    }

    openedCharacteristics.value = Object.fromEntries(
        characteristics.value.map((item: any) => [item.id, true])
    )
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

watch(currentPage, () => {
  loadProducts()
})

onMounted(() => {
  loadProducts()
})

watch(
    [
      () => selected.value.categories,
      () => selected.value.brands,
      () => selected.value.values,
      () => route.query.category,
      () => sortBy.value,
      currentPage
    ],
    async () => {
      await loadProducts()
    },
    { deep: true }
)

watch(
    () => selected.value.categories,
    async (categories) => {
      if (
          categories.length === 0 &&
          route.query.category
      ) {
        await router.replace({
          path: route.path,
          query: {
            ...route.query,
            category: undefined
          }
        })

        window.location.reload()
      }
    },
    { deep: true }
)

const openBlocks = ref({
  categories: true,
  brands: true,
  values: true
})

const toggleFavorite = async (product: any) => {
  const token = localStorage.getItem('token')

  if (!token) {
    return
  }

  try {
    const mutation = product.is_favorite
        ? DELETE_WISHLIST
        : ADD_WISHLIST

    const { data } = await apolloClient.mutate({
      mutation,
      variables: {
        id: product.id
      },
      context: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    })

    const response = product.is_favorite
        ? data?.deleteWishList
        : data?.addWishList

    if (response.status) {
      product.is_favorite = !product.is_favorite
    }

  } catch (error) {
    console.error('Wishlist mutation error:', error)
  }
}

const toggleBlock = (key: 'categories' | 'brands' | 'values') => {
  openBlocks.value[key] = !openBlocks.value[key]
}

const toggleCategory = (id: number) => {
  openedCategories.value[id] = !openedCategories.value[id]
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

const toggleCharacteristic = (id: number) => {
  openedCharacteristics.value[id] = !openedCharacteristics.value[id]
}

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('token');
});

const pageNumbers = computed(() => {
  const total = pagination.value.lastPage
  const current = currentPage.value

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | string)[] = []

  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', total)
    return pages
  }

  if (current >= total - 3) {
    pages.push(
        1,
        '...',
        total - 4,
        total - 3,
        total - 2,
        total - 1,
        total
    )
    return pages
  }

  pages.push(
      1,
      '...',
      current - 1,
      current,
      current + 1,
      '...',
      total
  )

  return pages
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
  user-select: none;
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
.category-child {
  padding-left: 35px;
  position: relative;
  font-size: 24px;
}

.category-parent {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.category-arrow {
  width: 10px;
  height: 10px;
  border-right: 3px solid #333;
  border-bottom: 3px solid #333;
  transform: rotate(45deg);
  transition: .2s ease;
  margin-right: 10px;
  cursor: pointer;
}

.category-arrow.open {
  transform: rotate(-135deg);
  border-color: #007bff;
}

.arrow,
.category-parent,
.category-parent * {
  user-select: none;
}

.color-value {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-dot {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  flex-shrink: 0;
}

.page-loader {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 99999;
  backdrop-filter: blur(2px);
}

.spinner {
  width: 80px;
  height: 80px;

  border: 8px solid #dbeafe;
  border-top: 8px solid #007bff;

  border-radius: 50%;

  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
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
  .category-child {
    padding-left: 35px;
    position: relative;
    font-size: 24px;
  }

  .category-parent {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .category-arrow {
    width: 10px;
    height: 10px;
    border-right: 3px solid #333;
    border-bottom: 3px solid #333;
    transform: rotate(45deg);
    transition: .2s ease;
    margin-right: 10px;
    cursor: pointer;
  }

  .category-arrow.open {
    transform: rotate(-135deg);
    border-color: #007bff;
  }

  .arrow,
  .category-parent,
  .category-parent * {
    user-select: none;
  }

  .color-value {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .color-dot {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid #d1d5db;
    flex-shrink: 0;
  }
}
</style>
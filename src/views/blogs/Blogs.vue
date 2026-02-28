<template>
  <section class="blogs-page">
    <nav class="breadcrumbs">
      <router-link to="/" class="crumb">Головна</router-link>
      <span class="separator">/</span>
      <span>Блог</span>
    </nav>

    <div class="blog-header">
      <h1 class="blog-title">Блог</h1>
      <div class="categories">
        <button
            v-for="category in categories"
            :key="category.id"
            :class="['category-tag', { active: activeCategory === category.slug }]"
            @click="activeCategory = category.slug"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <div class="blogs-grid">
      <article v-for="blog in blogs" :key="blog.id" class="blog-card">
        <img :src="blog.image" alt="" />
        <div class="content">
          <div class="badge-date">
            <span
                class="category-badge"
                :class="`cat-${blog.category_slug}`"
                :style="{ backgroundColor: blog.category_color }"
            >
              {{ blog.category }}
            </span>
            <span class="blog-date">{{ blog.date }}</span>
          </div>
          <h3 class="blog-card-title">{{ blog.title }}</h3>
          <p class="blog-card-excerpt">{{ blog.excerpt }}</p>
          <router-link :to="`/blogs/${blog.slug}`" class="read-more">Читати більше</router-link>
        </div>
      </article>
    </div>

    <div class="pagination">
      <button
          class="arrow"
          :disabled="page === 1 || loading"
          @click="page--"
      >
        ‹
      </button>

      <button
          v-for="pageNumber in pageNumbers"
          :key="pageNumber"
          :class="['page-number', { active: pageNumber === page }]"
          @click="page = pageNumber"
      >
        {{ pageNumber }}
      </button>

      <button
          class="arrow"
          :disabled="page === totalPages || loading"
          @click="page++"
      >
        ›
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { apolloClient } from '@/graphql/apolloClient'
import { GET_BLOGS } from '@/graphql/queries/blogs/blogs'
import { useToast } from 'vue-toastification'

interface BlogCategory {
  name: string
  slug: string
  color: string
  active: boolean
}

interface Blog {
  name: string
  slug: string
  image: string
  description: string
  short_description?: string
  published_at: string
  category: BlogCategory
}

interface BlogsResponse {
  blogs: {
    data: Blog[]
    filters: { id: number; name: string; slug: string }[]
    pagination: {
      currentPage: number
      firstItem: number
      lastItem: number
      lastPage: number
      total: number
    }
  }
}

const toast = useToast()

const blogs = ref<any[]>([])
const categories = ref<any[]>([])
const activeCategory = ref<string | null>(null)
const page = ref(1)
const perPage = 10
const totalPages = ref(1)
const loading = ref(false)

const truncate = (text: string, maxLength: number) => {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

const pageNumbers = computed(() => {
  const pages = Math.max(totalPages.value, 1)
  return Array.from({ length: pages }, (_, i) => i + 1)
})

const fetchBlogs = async () => {
  loading.value = true
  try {
    const result = await apolloClient.query<BlogsResponse>({
      query: GET_BLOGS,
      variables: {
        page: page.value,
        limit: perPage,
        category_slug: activeCategory.value,
      },
      fetchPolicy: 'no-cache',
    })

    if (!result.data || !result.data.blogs) {
      toast.error('Дані не отримано')
      return
    }

    blogs.value = result.data.blogs.data.map((b) => ({
      id: b.slug,
      title: b.name,
      slug: b.slug,
      excerpt: truncate(b.short_description || b.description || '', 120),
      image: b.image || '',
      category: b.category?.name || '',
      category_slug: b.category?.slug || '',
      category_color: b.category?.color || '#2563eb',
      date: new Date(b.published_at).toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }))

    categories.value = [
      { id: null, name: 'Всі статті', slug: null },
      ...(result.data.blogs.filters ?? []),
    ]

    totalPages.value = result.data.blogs.pagination.lastPage
  } catch (e: any) {
    console.error(e)
    toast.error(`Помилка завантаження блогів: ${e.message || e}`)
  } finally {
    loading.value = false
  }
}

watch([page, activeCategory], fetchBlogs, { immediate: true })

const paginatedBlogs = computed(() => blogs.value)
</script>

<style scoped>
.blogs-page {
  max-width: 80rem;
  margin: 0 auto;
  padding: 32px 32px;
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

.separator {
  margin: 0 8px;
}

.blog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  gap: 24px;
}

.blog-title {
  font-size: 65px;
  font-weight: 600;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  max-width: 900px;
}

.category-tag {
  padding: 10px 30px;
  border-radius: 999px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-size: 30px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  transition: all 0.2s ease;
}

.category-tag:hover {
  background: #007bff;
  color: #fff;
}

.category-tag.active {
  background: #007bff;
  color: #fff;
  border-color: #007bff;
}

.blogs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
}

.blog-card {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #eee;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.blog-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.blog-card .content {
  display: flex;
  flex-direction: column;
  padding: 20px;
  flex-grow: 1;
}

.badge-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.category-badge {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}

.cat-news { background: #2563eb; }
.cat-analytics { background: #7c3aed; }
.cat-guides { background: #059669; }

.blog-date {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.blog-card-title {
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.3;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.blog-card-excerpt {
  font-size: 18px;
  line-height: 1.5;
  color: #555;
  margin-bottom: auto;
}

.read-more {
  font-size: 20px;
  color: #007bff;
  text-decoration: none;
  margin-top: 16px;
}

.read-more:hover {
  text-decoration: underline;
}

.pagination {
  margin-top: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.page-number {
  width: 40px;
  height: 40px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
}

.page-number:hover {
  background: #f0f0f0;
}

.page-number.active {
  background: #007bff;
  color: #fff;
  border-color: #007bff;
}

.arrow {
  width: 40px;
  height: 40px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
}

.arrow:disabled {
  opacity: 0.4;
  cursor: default;
}

.arrow:hover:not(:disabled) {
  background: #0056b3;
}

@media (min-width: 2560px) {
  .blogs-page {
    max-width: 110rem;
    margin: 0 auto;
    padding: 32px 32px;
  }
}
</style>


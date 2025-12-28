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
            :class="['category-tag', { active: activeCategory === category.id }]"
            @click="activeCategory = category.id"
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
            <span class="category-badge" :class="`cat-${blog.category_slug}`">{{ blog.category }}</span>
            <span class="blog-date">{{ blog.date }}</span>
          </div>
          <h3 class="blog-card-title">{{ blog.title }}</h3>
          <p class="blog-card-excerpt">{{ blog.excerpt }}</p>
          <router-link :to="`/blog/${blog.slug}`" class="read-more">Читати більше</router-link>
        </div>
      </article>
    </div>

    <div class="pagination">
      <button
          class="arrow"
          :disabled="page === 1"
          @click="page--"
      >
        ‹
      </button>

      <button
          v-for="pageNumber in totalPages"
          :key="pageNumber"
          :class="['page-number', { active: pageNumber === page }]"
          @click="page = pageNumber"
      >
        {{ pageNumber }}
      </button>

      <button
          class="arrow"
          :disabled="page === totalPages"
          @click="page++"
      >
        ›
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeCategory = ref<number>(1)
const page = ref(1)
const perPage = 1

const categories = ref([
  { id: 1, name: 'Всі статті' },
  { id: 2, name: 'Новини' },
  { id: 3, name: 'Аналітика' },
  { id: 4, name: 'Огляди' },
  { id: 5, name: 'Гіди' },
])

const blogs = ref([
  {
    id: 1,
    title: 'Як правильно писати блог',
    slug: 'iag-1',
    excerpt: 'Короткий опис статті у 2–3 рядки, який зацікавлює читача.',
    category: 'Гіди',
    category_slug: 'guides',
    date: '25 грудня 2025',
    image: '../../src/assets/3.jpg',
  },
  {
    id: 2,
    title: 'Нові тренди 2025',
    slug: 'iag-1',
    excerpt: 'Огляд ключових трендів цього року та їх впливу на бізнес.',
    category: 'Аналітика',
    category_slug: 'analytics',
    date: '24 грудня 2025',
    image: 'https://via.placeholder.com/400x250',
  },
  {
    id: 3,
    title: 'Що нового у Vue 3',
    slug: 'iag-1',
    excerpt: 'Розбираємо нові можливості фреймворку та best practices.',
    category: 'Новини',
    category_slug: 'news',
    date: '23 грудня 2025',
    image: 'https://via.placeholder.com/400x250',
  },
  {
    id: 3,
    title: 'Що нового у Vue 3',
    slug: 'iag-1',
    excerpt: 'Розбираємо нові можливості фреймворку та best practices.',
    category: 'Новини',
    category_slug: 'news',
    date: '23 грудня 2025',
    image: 'https://via.placeholder.com/400x250',
  },
  {
    id: 4,
    title: 'Що нового у Vue 3',
    slug: 'iag-1',
    excerpt: 'Розбираємо нові можливості фреймворку та best practices.',
    category: 'Новини',
    category_slug: 'news',
    date: '23 грудня 2025',
    image: 'https://via.placeholder.com/400x250',
  },
  {
    id: 5,
    title: 'Що нового у Vue 3',
    slug: 'iag-1',
    excerpt: 'Розбираємо нові можливості фреймворку та best practices.',
    category: 'Новини',
    category_slug: 'news',
    date: '23 грудня 2025',
    image: 'https://via.placeholder.com/400x250',
  },
  {
    id: 6,
    title: 'Що нового у Vue 3',
    slug: 'iag-1',
    excerpt: 'Розбираємо нові можливості фреймворку та best practices.',
    category: 'Новини',
    category_slug: 'news',
    date: '23 грудня 2025',
    image: 'https://via.placeholder.com/400x250',
  },
])

const totalPages = computed(() => Math.ceil(blogs.value.length / perPage))
</script>

<style scoped>
.blogs-page {
  max-width: 105rem;
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
    max-width: 125rem;
    margin: 0 auto;
    padding: 32px 32px;
  }
}
</style>


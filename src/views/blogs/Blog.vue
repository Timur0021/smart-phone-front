<template>
  <section class="blog-page">
    <nav class="breadcrumbs">
      <router-link to="/" class="crumb">Головна</router-link>
      <span class="separator">/</span>
      <router-link to="/blogs" class="crumb">Блог</router-link>
      <span class="separator">/</span>
      <span class="current">{{ blog.title }}</span>
    </nav>

    <div class="blog-wrapper">
      <div class="blog-main">
        <div class="blog-card">
          <h1 class="blog-title">{{ blog.title }}</h1>
          <div class="meta">
            <span class="category-badge" :class="`cat-${blog.category_slug}`">{{ blog.category }}</span>
            <span class="blog-date">{{ blog.date }}</span>
          </div>
          <img :src="blog.image" alt="" class="blog-image" />
          <article class="blog-content">
            <p v-for="(paragraph, idx) in blog.content" :key="idx" class="blog-paragraph">
              {{ paragraph }}
            </p>
          </article>
        </div>
        <router-link to="/blogs" class="back-link">← Повернутись до блогу</router-link>
      </div>

      <aside class="blog-sidebar">
        <h2>Зміст</h2>
        <ul>
          <li v-for="(section, idx) in blog.content" :key="idx">
            <span class="section-number">{{ idx + 1 }}.</span> Розділ {{ idx + 1 }}
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const blogId = route.params.id

const blog = ref({
  id: blogId,
  title: 'Як правильно писати блог',
  category: 'Гіди',
  category_slug: 'guides',
  date: '25 грудня 2025',
  image: '../../src/assets/3.jpg',
  content: [
    'Перший абзац статті з основним вступом.',
    'Другий абзац із більш детальним описом і прикладами.',
    'Третій абзац з висновками та порадами для читача.',
  ],
})
</script>

<style scoped>
.blog-page {
  max-width: 105rem;
  margin: 0 auto;
  padding: 32px 20px;
}

.breadcrumbs {
  display: flex;
  gap: 8px;
  font-size: 25px;
  margin-bottom: 32px;
  color: #555;
}

.crumb { color: #007bff; text-decoration: none; }
.separator { color: #888; }

.blog-wrapper {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.blog-main {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 300px;
}

.blog-card {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.blog-title {
  font-size: 36px;
  font-weight: 600;
  line-height: 1.2;
}

.meta {
  display: flex;
  gap: 50px;
  align-items: center;
}

.category-badge {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 25px;
  font-weight: 500;
  color: #fff;
}

.cat-news { background: #2563eb; }
.cat-analytics { background: #7c3aed; }
.cat-guides { background: #059669; }

.blog-date {
  font-size: 25px;
  color: #666;
}

.blog-image {
  width: 100%;
  height: auto;
  border-radius: 16px;
  object-fit: cover;
}

.blog-content {
  font-size: 18px;
  line-height: 1.7;
  color: #333;
}

.blog-paragraph {
  margin-bottom: 20px;
}

.back-link {
  display: inline-block;
  font-size: 25px;
  color: #007bff;
  text-decoration: none;
  margin-top: 16px;
}

.back-link:hover {
  text-decoration: underline;
}

.blog-sidebar {
  flex: 0 0 500px;
  max-width: 50%;
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  position: sticky;
  top: 32px;
  height: fit-content;
}


.blog-sidebar h2 {
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 16px;
}

.blog-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.blog-sidebar li {
  font-size: 25px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.section-number {
  color: #007bff;
  font-weight: 600;
  margin-right: 6px;
}

@media (min-width: 2560px) {
  .blog-page {
    max-width: 125rem;
    margin: 0 auto;
    padding: 32px 20px;
  }
}
</style>

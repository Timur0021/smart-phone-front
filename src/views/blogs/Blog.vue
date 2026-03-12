<template>
  <section class="blog-page">
    <nav class="breadcrumbs">
      <router-link to="/" class="crumb">Головна</router-link>
      <span class="separator">/</span>
      <router-link to="/blogs" class="crumb">Блог</router-link>
      <span class="separator">/</span>
      <span class="current">{{ blog?.name }}</span>
    </nav>

    <div class="blog-wrapper">
      <div class="blog-main">
        <div class="blog-card">
          <h1 class="blog-title">{{ blog?.name }}</h1>
          <div class="meta">
           <span
               class="category-badge"
               :class="`cat-${blog?.category.slug}`"
               :style="{ backgroundColor: blog?.category.color }"
           >
              {{ blog?.category.name }}
           </span>
            <span class="blog-date">{{ formattedDate }}</span>
          </div>
          <img :src="blog?.image" alt="" class="blog-image" />
          <article class="blog-content" v-html="blogHtmlWithIds"></article>
        </div>
        <router-link to="/blogs" class="back-link">← Повернутись до блогу</router-link>
      </div>

      <aside class="blog-sidebar" v-if="blog">
        <h2>Зміст</h2>
        <ul>
          <li v-for="section in blogSections" :key="section.id">
            <a href="javascript:void(0)" @click="scrollToSection(section.id)">
              {{ section.text }}
            </a>
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>

<<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { apolloClient } from '@/graphql/apolloClient'
import { BLOG } from "@/graphql/queries/blogs/blog.ts";
import { useToast } from 'vue-toastification'
import type { DocumentNode } from 'graphql'

interface BlogCategory {
  name: string
  slug: string
  color: string
  active: boolean
}

interface BlogType {
  name: string
  slug: string
  image: string
  description: string
  short_description?: string
  published_at: string
  category: BlogCategory
}

interface BlogQueryResult {
  blog: BlogType
}

const route = useRoute()
const toast = useToast()
const slug = route.params.slug as string
const blog = ref<BlogType | null>(null)

const formattedDate = computed(() => {
  if (!blog.value) return ''
  const d = new Date(blog.value.published_at)
  return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
})

const blogSections = computed(() => {
  if (!blog.value) return []

  const parser = new DOMParser()
  const doc = parser.parseFromString(blog.value.description, 'text/html')

  const headers = Array.from(doc.querySelectorAll('h1, h2, h3, strong'))

  return headers.map((el, idx) => ({
    text: el.textContent || `Розділ ${idx + 1}`,
    id: `section-${idx + 1}`
  }))
})

const blogHtmlWithIds = computed(() => {
  if (!blog.value) return ''
  const parser = new DOMParser()
  const doc = parser.parseFromString(blog.value.description, 'text/html')

  const headers = doc.querySelectorAll('h1, h2, h3, strong')
  headers.forEach((el, idx) => el.setAttribute('id', `section-${idx + 1}`))

  return doc.body.innerHTML
})

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    const yOffset = -20
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

const fetchBlog = async () => {
  try {
    const result = await apolloClient.query<BlogQueryResult>({
      query: BLOG as DocumentNode,
      variables: { slug }
    })

    if (result.data?.blog) {
      blog.value = result.data.blog
    } else {
      toast.error('Блог не знайдено')
    }
  } catch (e: any) {
    toast.error(`Помилка завантаження блогів: ${e.message || e}`)
    console.error(e)
  }
}

onMounted(() => {
  fetchBlog()
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

.blog-date {
  font-size: 25px;
  color: #666;
  margin-left: auto;
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

.blog-sidebar li a {
  color: #000;
  text-decoration: none;
  transition: color 0.2s ease;
}

.blog-sidebar li a:hover {
  color: #007bff;
}

@media (min-width: 2560px) {
  .blog-page {
    max-width: 125rem;
    margin: 0 auto;
    padding: 32px 20px;
  }
}
</style>

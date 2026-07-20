<template>
  <header class="header">
    <div v-if="firstText" class="top-banner">
      <span>{{ firstText.text }}</span>
      <a
          :href="firstText.link"
          class="top-link"
          :target="firstText.is_new_window ? '_blank' : '_self'"
          :rel="firstText.is_new_window ? 'noopener noreferrer' : undefined"
      >
        {{ t('more_details') }}
      </a>
    </div>

    <nav class="second-nav">
      <div class="nav-left">
        <RouterLink to="/" class="logo">Cyberon</RouterLink>
      </div>

      <div class="nav-center">
        <RouterLink
            v-for="page in sidebarPages"
            :key="page.id"
            :to="`/${page.slug}`"
            class="page-link"
        >
          {{ page.title }}
        </RouterLink>
      </div>

      <div class="nav-right">
        <div class="lang-switcher" @click="toggleLang">
          <div :class="['switch', currentLang]">
            <span class="ua">UA</span>
            <span class="en">EN</span>
            <div class="slider">
              <span>{{ currentLang }}</span>
            </div>
          </div>
        </div>

        <div v-if="phone" class="phone" @click="togglePhonePopup">{{ phone.value }}</div>

        <div v-if="showPhonePopup" class="phone-popup" @click.self="showPhonePopup = false">
          <div class="phone-popup-content">
            <p v-if="phone">{{ phone.value }}</p>
            <p v-if="workOurs">{{ workOurs.text }}</p>
            <button @click="openContactPopup">Зв'яжіться з нами</button>
          </div>
        </div>

        <div v-if="showContactPopup" class="contact-popup" @click.self="closeContactPopup">
          <div class="contact-popup-content">
            <button class="close-popup" @click="closeContactPopup">×</button>
            <h2>Зворотній зв'язок</h2>
            <input
                type="tel"
                v-model="contactPhone"
                @input="formatPhone"
                placeholder="+380XXXXXXXXX"
            />
            <button @click="orderCall">Замовити дзвінок</button>
            <p class="contact-info">
              Натискаючи на кнопку, я погоджуюся з політикою конфіденційності цього сайту.
            </p>
          </div>
        </div>
      </div>
    </nav>

    <nav class="third-nav">
      <div class="catalog" @mouseleave="hoveredCategory = null">
        <button @click="catalogOpen = !catalogOpen">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" class="catalog-icon">
            <path d="M7.5 2.5H3.333a.833.833 0 0 0-.833.833V7.5c0 .46.373.833.833.833H7.5c.46 0 .833-.373.833-.833V3.333A.833.833 0 0 0 7.5 2.5ZM16.667 2.5H12.5a.833.833 0 0 0-.833.833V7.5c0 .46.373.833.833.833h4.167c.46 0 .833-.373.833-.833V3.333a.833.833 0 0 0-.833-.833ZM16.667 11.667H12.5a.833.833 0 0 0-.833.833v4.167c0 .46.373.833.833.833h4.167c.46 0 .833-.373.833-.833V12.5a.833.833 0 0 0-.833-.833ZM7.5 11.667H3.333a.833.833 0 0 0-.833.833v4.167c0 .46.373.833.833.833H7.5c.46 0 .833-.373.833-.833V12.5a.833.833 0 0 0-.833-.833Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          Каталог
        </button>

        <div v-if="catalogOpen" class="catalog-menu">
          <div v-for="category in categories" :key="category.id" class="category-item"
               @mouseenter="hoveredCategory = Number(category.id)">
            <RouterLink
                :to="category.will_be_soon ? '#' : category.link"
                :class="['category-link', { 'disabled-link': category.will_be_soon }]"
            >
              {{ category.name }}
              <span v-if="category.will_be_soon" class="soon-label">Скоро</span>
            </RouterLink>

            <div
                v-if="hoveredCategory === Number(category.id) && category.children?.length"
                :class="['subcategory-menu', { scrollable: category.children.length > 7 }]"
            >
              <RouterLink
                  v-for="sub in category.children"
                  :key="sub.id"
                  :to="sub.link"
              >
                {{ sub.name }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Пошук..." @focus="showPopup = true" @blur="hidePopup" />
        <button @click="onSearch">Знайти</button>

        <div v-if="showPopup" class="search-popup">
          <div class="popup-title">Часто шукають</div>
          <div class="popup-item">Телефон</div>
          <div class="popup-item">Планшет</div>
        </div>
      </div>

      <div class="user-icons">
        <button @click="goToDashboard">
          <i class="fa-solid fa-user" style="color: #000000;"></i>
        </button>
        <button v-if="isAuthenticated">❤️</button>
        <button>🛒</button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { onMounted, ref, watch as vueWatch, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { apolloClient } from "@/graphql/apolloClient.ts";
import { GET_SETTINGS } from "@/graphql/queries/settings/settings.ts";
import { CREATE_REQUEST } from "@/graphql/mutations/request/request.ts";
import { useToast } from "vue-toastification";

const toast = useToast();
const currentLang = ref<'UA' | 'EN'>('UA')

const sidebarPages = ref<{ id: string; title: string; slug: string }[]>([]);
const textInSite = ref<{ text: string; link: string; is_new_window?: boolean }[]>([]);
const categories = ref<{ id: string; name: string; link: string; children?: any[]; will_be_soon?: boolean }[]>([]);
const settings = ref<{ name: string; key: string; value: string; is_new_window?: boolean }[]>([]);

const firstText = computed(() => textInSite.value?.[0] || null)
const workOurs = computed(() => textInSite.value?.[1] || null)
const phone = computed(() => settings.value?.[0] || null)

const catalogOpen = ref(false)
const searchQuery = ref('')

const showPopup = ref(false)
const showPhonePopup = ref(false)

const hoveredCategory = ref<number | null>(null)

const showContactPopup = ref(false)
const contactPhone = ref('')

function openContactPopup() {
  showContactPopup.value = true
}

function closeContactPopup() {
  showContactPopup.value = false
}

const t = (key: string) => key
const router = useRouter()

async function loadSettings() {
  try {
    const { data } = await apolloClient.query({
      query: GET_SETTINGS,
      context: {
        headers: {
          'Next-locale': currentLang.value.toLowerCase()
        }
      },
      fetchPolicy: 'no-cache'
    })

    const textInSiteData = data?.settings?.text_in_site || []
    const sidebarsData = data?.settings?.sidebars?.[0]
    const categoriesData = data?.settings?.product_categories || []
    const settingsData = data?.settings?.settings || []

    if (textInSiteData.length) {
      textInSite.value = textInSiteData.map((t: any) => ({
        text: t.text,
        link: t.link || '#',
        is_new_window: t.is_new_window || false,
      }))
    }

    if (sidebarsData && sidebarsData.pages?.length) {
      sidebarPages.value = sidebarsData.pages.map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
      }))
    } else {
      sidebarPages.value = []
    }

    if (categoriesData) {
      categories.value = (categoriesData || []).map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        link: {
          path: '/products',
          query: {
            category: cat.slug
          }
        },
        will_be_soon: cat.will_be_soon || false,
        children: (cat.children || []).map((child: any) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
          link: {
            path: '/products',
            query: {
              category: child.slug
            }
          }
        }))
      }))
    } else {
      categories.value = []
    }

    if (settingsData.length) {
      settings.value = settingsData.map((s: any) => ({
        name: s.name,
        key: s.key,
        value: s.value,
        is_new_window: s.is_new_window || false,
      }))
    }
  } catch (error) {
    console.error('GraphQL error:', error)
  }
}

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('token');
});

onMounted(() => {
  const savedLang = localStorage.getItem('siteLang') as 'UA' | 'EN' | null
  if (savedLang) currentLang.value = savedLang
  loadSettings()
})

vueWatch(currentLang, () => {
  loadSettings()
})

function toggleLang() {
  currentLang.value = currentLang.value === 'UA' ? 'EN' : 'UA'
  localStorage.setItem('siteLang', currentLang.value)

  const path =
      currentLang.value === 'EN'
          ? `/en${router.currentRoute.value.fullPath.replace(/^\/en/, '')}`
          : router.currentRoute.value.fullPath.replace(/^\/en/, '')

  router.push(path)
}

function goToDashboard() {
  const token = localStorage.getItem('token');

  if (!token) {
    toast.error("Спочатку увійдіть у свій акаунт");
    router.push({ name: 'login' });
    return;
  }

  router.push({ name: 'dashboard' });
}

interface CreateRequestResponse {
  createRequest: {
    message: string
    status: string
  }
}

async function orderCall() {
  if (!contactPhone.value) {
    toast.error('Введіть номер телефону')
    return
  }

  if (!isValidPhone(contactPhone.value)) {
    toast.error('Невірний формат номера телефону')
    return
  }

  try {
    const result = await apolloClient.mutate<CreateRequestResponse>({
      mutation: CREATE_REQUEST,
      variables: { phone: contactPhone.value }
    })

    const data = result.data
    if (data?.createRequest?.status === 'Успіх') {
      toast.success(data.createRequest.message)
    } else {
      toast.error(data?.createRequest?.message || 'Сталася помилка')
    }

    showContactPopup.value = false
    contactPhone.value = ''
  } catch (error) {
    console.error(error)
    toast.error('Сталася помилка при замовленні дзвінка')
  }
}

function formatPhone(e: Event) {
  let value = (e.target as HTMLInputElement).value

  value = value.replace(/[^\d+]/g, '')

  if (value.startsWith('+')) {
    value = '+' + value.slice(1).replace(/\+/g, '')
  } else {
    value = value.replace(/\+/g, '')
  }

  value = value.slice(0, 15)

  contactPhone.value = value
}

function isValidPhone(phone: string): boolean {
  const uaPattern = /^(\+380\d{9}|0\d{9})$/
  return uaPattern.test(phone)
}

function onSearch() {
  console.log('Шукати:', searchQuery.value)
}

function hidePopup() {
  setTimeout(() => showPopup.value = false, 150)
}

function togglePhonePopup() {
  showPhonePopup.value = !showPhonePopup.value
}

function contactUs() {
  window.location.href = '/contacts'
}
</script>

<style lang="css" scoped>
@import "css/HeaderStyles.css";
</style>

<template>
  <header class="header">
    <div v-if="topText" class="top-banner">
      <span>{{ topText.text }}</span>
      <a :href="topText.link" class="top-link">{{ t('more_details') }}</a>
    </div>

    <nav class="second-nav">
      <div class="nav-left">
        <RouterLink to="/" class="logo">Cyberon</RouterLink>
      </div>

      <div class="nav-center">
        <RouterLink
            v-for="page in sidebarPages"
            :key="page.id"
            to="/promotions/"
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

        <div class="phone" @click="togglePhonePopup">+380504741854</div>

        <div v-if="showPhonePopup" class="phone-popup" @click.self="showPhonePopup = false">
          <div class="phone-popup-content">
            <p>+380504741854</p>
            <p>9:00-18:00; сб, нд — вихідні</p>
            <button @click="openContactPopup">Зв'яжіться з нами</button>
          </div>
        </div>

        <div v-if="showContactPopup" class="contact-popup" @click.self="closeContactPopup">
          <div class="contact-popup-content">
            <button class="close-popup" @click="closeContactPopup">×</button>
            <h2>Зворотній зв'язок</h2>
            <input type="text" v-model="contactPhone" placeholder="Ваш номер телефону" />
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
               @mouseenter="hoveredCategory = category.id">
            <RouterLink :to="category.link">{{ category.name }}</RouterLink>

            <div
                v-if="hoveredCategory === category.id && category.children?.length"
                :class="['subcategory-menu', { scrollable: category.children.length > 7 }]"
            >
              <RouterLink v-for="sub in category.children" :key="sub.id" :to="sub.link">{{ sub.name }}</RouterLink>
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
        <button>👤</button>
        <button>❤️</button>
        <button>🛒</button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { onMounted, ref, watch as vueWatch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { apolloClient} from "@/graphql/apolloClient.ts";
import { GET_SETTINGS } from "@/graphql/queries/settings/settings.ts";

const currentLang = ref<'UA' | 'EN'>('UA')
const topText = ref<{ text: string, link: string } | null>(null);
const sidebarPages = ref<{ id: string; title: string; slug: string }[]>([])
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
    const textData = data?.settings?.text_in_site?.[0]
    const sidebarData = data?.settings?.sidebars?.[0]

    if (textData) {
      topText.value = {
        text: textData.text,
        link: textData.link || '#',
      }
    }

    if (sidebarData && sidebarData.pages?.length) {
      sidebarPages.value = sidebarData.pages.map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
      }))
    } else {
      sidebarPages.value = []
    }
  } catch (error) {
    console.error('GraphQL error:', error)
  }
}

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

const showContactPopup = ref(false)
function openContactPopup() {
  showContactPopup.value = true
}

function closeContactPopup() {
  showContactPopup.value = false
}

const contactPhone = ref('')

function orderCall() {
  if (!contactPhone.value) {
    alert('Введіть номер телефону')
    return
  }
  console.log('Замовлено дзвінок на:', contactPhone.value)
  showContactPopup.value = false
}

const catalogOpen = ref(false)
const searchQuery = ref('')
const showPopup = ref(false)
const hoveredCategory = ref<number | null>(null)
const categories = ref([
  {
    id: 1, name: 'Телефони', link: '/phones', children: [
      {id: 11, name: 'Samsung', link: '/phones/samsung'},
      {id: 12, name: 'Apple', link: '/phones/apple'},
      {id: 13, name: 'Xiaomi', link: '/phones/xiaomi'},
      {id: 14, name: 'Huawei', link: '/phones/huawei'},
      {id: 15, name: 'Realme', link: '/phones/realme'},
      {id: 16, name: 'Oppo', link: '/phones/oppo'},
      {id: 17, name: 'Vivo', link: '/phones/vivo'},
      {id: 18, name: 'OnePlus', link: '/phones/oneplus'},
      {id: 19, name: 'Nokia', link: '/phones/nokia'},
      {id: 20, name: 'Sony', link: '/phones/sony'},
    ]
  },
  { id: 2, name: 'Планшети', link: '/tablets', children: [
      { id: 21, name: 'Samsung', link: '/tablets/samsung' },
      { id: 22, name: 'Apple', link: '/tablets/apple' },
    ]
  },
  { id: 3, name: 'Навушники', link: '/headphones' },
  { id: 4, name: 'Зарядне', link: '/chargers' },
])

function onSearch() {
  console.log('Шукати:', searchQuery.value)
}

function hidePopup() {
  setTimeout(() => showPopup.value = false, 150)
}

const showPhonePopup = ref(false)
function togglePhonePopup() {
  showPhonePopup.value = !showPhonePopup.value
}
function contactUs() {
  window.location.href = '/contacts'
}
</script>

<style lang="less" scoped>
.header { font-family: 'Helvetica Neue', Arial, sans-serif; width: 100%; margin: 0; }

.top-banner {
  background: linear-gradient(90deg,#1e3a8a,#2563eb);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 12px 32px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
}
.top-link { color: #fff; text-decoration: underline; font-weight: 600; font-size: 18px; }
.top-link:hover { color: #ffffff; }

.second-nav {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
  padding: 24px 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  position: relative;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  font-size: 20px;
  font-weight: 700;
  gap: 32px;
}
.nav-left { display: flex; align-items: center; gap: 16px; margin-left: 200px; }
.logo { font-weight: bold; font-size: 36px; color: #1e40af; text-decoration: none; margin-right: 90px; }
.nav-center { display: flex; gap: 50px; }
.page-link { text-decoration: none; color: #1e40af; font-weight: 700; font-size: 20px; transition: color 0.2s; }
.page-link:hover { color: #2563eb; }
.nav-right { margin-left: auto; display: flex; align-items: center; gap: 40px; margin-right: 150px; position: relative; }
.phone { font-size: 19px; cursor: pointer; padding: 10px 16px; border-radius: 6px; background: #c7d2fe; font-weight: 600; transition: all 0.2s; }
.phone:hover { background: #a5b4fc; }

/* Телефонний попап */
.phone-popup {
  position: absolute;
  top: 60px;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  padding: 20px;
  min-width: 250px;
  z-index: 50;
}
.phone-popup-content p { margin: 0 0 10px 0; font-size: 18px; color: #1e40af; font-weight: 600; }
.phone-popup-content button {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 20px 75px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  display: block;
  margin: 10px auto 0;
  white-space: nowrap;
}

.phone-popup-content button:hover { background: #1e40af; }

.lang-switcher { cursor: pointer; }
.switch {
  position: relative;
  width: 100px;
  height: 44px;
  background: #e0e7ff;
  border-radius: 22px;
  display: flex;
  font-size: 16px;
  font-weight: 800;
  color: #1e40af;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  overflow: hidden;
  transition: all 0.3s;
  letter-spacing: 0.5px;
}
.switch span { flex: 1; text-align: center; line-height: 44px; z-index: 2; transition: color 0.3s; text-shadow: 0 1px 1px rgba(0,0,0,0.2); }
.switch .slider {
  position: absolute; top: 2px; left: 2px; width: 50px; height: 40px;
  background: #1e40af; border-radius: 20px;
  display: flex; justify-content: center; align-items: center;
  color: #fff; font-weight: 800; font-size: 16px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  transition: left 0.3s;
}
.switch.EN .slider { left: 50px; }
.switch.UA span.ua { color: #fff; }
.switch.UA span.en { color: #1e40af; }
.switch.EN span.ua { color: #1e40af; }
.switch.EN span.en { color: #fff; }

/* Третя навігація */
.third-nav { display: flex; justify-content: flex-start; align-items: center; gap: 36px; background: #fff; padding: 16px 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); font-size: 20px; font-weight: 700; position: relative; border-top: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05); }
.third-nav .catalog { margin-left: 175px; position: relative; }
.third-nav .catalog button { display: flex; align-items: center; gap: 8px; background: #e0e7ff; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 24px; color: #1e40af; transition: all 0.2s; }
.third-nav .catalog button:hover { background: #c7d2fe; color: #1e40af; }
.catalog-icon { width: 28px; height: 28px; }

.catalog-menu { position: absolute; top: 130%; left: 0; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.12); border-radius: 6px; display: flex; flex-direction: column; min-width: 170px; z-index: 10; }
.category-item { position: relative; }
.category-item > a { padding: 10px 16px; display: block; text-decoration: none; color: #1e40af; font-weight: 700; font-size: 18px; transition: color 0.2s, background 0.2s; }
.category-item > a:hover { background: #e0e7ff; color: #1e40af; }

.subcategory-menu {
  position: absolute; top: 0; left: 100%; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.12); border-radius: 6px;
  display: flex; flex-direction: column; min-width: 170px; z-index: 20; max-height: 350px; overflow-y: auto; padding-right: 4px;
}
.subcategory-menu a { padding: 10px 16px; text-decoration: none; color: #1e40af; font-weight: 700; font-size: 18px; }
.subcategory-menu a:hover { background: #e0e7ff; color: #1e40af; }
.subcategory-menu.scrollable a:hover { background: #1e40af; color: #fff; }

.subcategory-menu.scrollable::-webkit-scrollbar { width: 6px; }
.subcategory-menu.scrollable::-webkit-scrollbar-track { background: #c7d2fe; border-radius: 3px; }
.subcategory-menu.scrollable::-webkit-scrollbar-thumb { background: #1e40af; border-radius: 3px; }
.subcategory-menu.scrollable { scrollbar-width: thin; scrollbar-color: #1e40af #c7d2fe; }

.third-nav .search-bar { position: relative; margin-left: 40px; width: 65rem; }
.third-nav .search-bar input { width: 100%; padding: 6px 12px; padding-right: 100px; font-size: 18px; font-weight: 700; border: 1px solid #d1d5db; border-radius: 8px; color: #1e40af; box-sizing: border-box; height: 44px; }
.third-nav .search-bar button { position: absolute; top: 0; right: 0; height: 100%; border: none; background: #2563eb; color: #fff; border-radius: 0 8px 8px 0; padding: 0 16px; cursor: pointer; font-weight: 700; font-size: 18px; line-height: 44px; transition: background 0.2s; }
.third-nav .search-bar button:hover { background: #1e40af; }

.search-popup { position: absolute; top: 110%; left: 0; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); padding: 24px 24px 20px; width: 95%; z-index: 30; }
.search-popup .popup-title { color: #6b7280; font-weight: 700; font-size: 30px; margin-bottom: 20px; }
.search-popup .popup-item { color: #000; font-size: 20px; margin-bottom: 25px; cursor: pointer; }
.search-popup .popup-item:hover { color: #2563eb; }

.third-nav .user-icons { display: flex; gap: 12px; }
.third-nav .user-icons button { background: #e0e7ff; border: none; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; font-size: 20px; font-weight: 700; color: #1e40af; display: flex; justify-content: center; align-items: center; transition: background 0.2s; }
.third-nav .user-icons button:hover { background: #c7d2fe; }

@media (min-width: 2560px) {
  .nav-left { margin-left: 350px; }
  .nav-right { margin-right: 300px; }

  .third-nav .catalog { margin-left: 350px; }

  .third-nav .search-bar {
    width: 85rem;
    margin-left: 35px;
  }

  .search-popup {
    width: 95%;
    padding: 32px 32px 28px;
  }
}
.contact-popup {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.contact-popup-content {
  background: #fff;
  border-radius: 16px;
  padding: 64px;
  width: 640px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  text-align: center;
  position: relative;
}

.contact-popup-content h2 {
  font-size: 48px;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 32px;
}

.contact-popup-content input {
  padding: 28px;
  font-size: 32px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
}

.contact-popup-content button {
  padding: 28px;
  font-size: 32px;
  font-weight: 700;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.contact-popup-content button:hover { background: #1e40af; }

.contact-popup-content .contact-info {
  font-size: 18px;
  color: #6b7280;
  margin: 12px 0 0 0;
  text-align: center;
}
.contact-popup-content .close-popup {
  position: absolute;
  top: 20px;
  right: 46px;
  background: transparent !important;
  border: none;
  font-size: 45px;
  font-weight: bold;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: auto;
  height: auto;
  line-height: 1;
}

.contact-popup-content .close-popup:hover {
  color: #374151;
}
.close-popup {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 36px;
  font-weight: bold;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s;
}
</style>

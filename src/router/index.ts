import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/en',
        component: HomeView
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach((to, from, next) => {
    const lang = localStorage.getItem('siteLang') || 'UA'

    if (lang === 'EN' && !to.path.startsWith('/en')) {
        return next(`/en${to.fullPath}`)
    }

    if (lang === 'UA' && to.path.startsWith('/en')) {
        return next(to.fullPath.replace(/^\/en/, ''))
    }

    next()
})

export default router

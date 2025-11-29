import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
    {
        path: '/:lang(en)?',
        name: 'home',
        component: HomeView,
        props: true
    },
    {
        path: '/:lang(en)?/blog',
        name: 'blogs',
        component: () => import('../views/Brands.vue')
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView.vue'),
    },
    {
        path: '/:lang(en)?/register',
        name: 'register',
        component: () => import('../views/auth/Register.vue'),
    },
    {
        path: '/:lang(en)?/login',
        name: 'login',
        component: () => import('../views/auth/Login.vue'),
    },
    {
        path: '/:lang(en)?/dashboard',
        name: 'dashboard',
        component: () => import('../views/dashboard/Dashboard.vue'),
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

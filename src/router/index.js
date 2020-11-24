import VueRouter from 'vue-router'
import App from '@/App.vue'

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: App,
        },
    ]
})

export default router

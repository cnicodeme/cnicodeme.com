import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/:name',
        component: () => import(/* webpackChunkName: "Login" */ '@/Generator')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    linkActiveClass: 'active',
    routes,
    scrollBehavior (to, from, savedPosition) {
        if (to.meta.basename) {
            return
        }

        return { x: 0, y: 0 }
    }
})

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    router
}).$mount('#app')

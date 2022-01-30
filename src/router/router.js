import {createRouter, createWebHashHistory, createWebHistory} from "vue-router"
import Layout from '../views/layout/Layout.vue'
import CompareIndex from "../components/compare/CompareIndex.vue";
import CompareFirst from "../components/compare/CompareFirst.vue";
// 2. 定义路由配置
const routes = [
    {
        path: "/",
        redirect: '/compare/index'
    },
    {
        path: "/layout", component: Layout, children: [
            {path:"/compare/index",component:CompareIndex},
            {path:"/compare/first",component:CompareFirst},
        ]
    },

];

// 3. 创建路由实例
const router = createRouter({
    // 4. 采用hash 模式
    history: createWebHashHistory(),
    // 采用 history 模式
    // history: createWebHistory(),
    routes, // short for `routes: routes`
});

export default router
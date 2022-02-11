import {createRouter, createWebHashHistory} from "vue-router"
import Layout from '../views/layout/Layout.vue'
import CompareIndex from "../views/compare/CompareIndex.vue"
import CompareFirst from "../views/compare/CompareFirst.vue"
import CompareSecond from "../views/compare/CompareSecond.vue";
import Yi2Fan from "../views/tools/Yi2Fan.vue";
import Jian2Fan from "../views/tools/Jian2Fan.vue";
import Setting from "../views/setting/Setting.vue";
import PreviewHtml from "../views/compare/preview/PreviewHtml.vue";
import BooksCompare from "../views/tools/BooksCompare.vue";
import BooksSearch from "../views/tools/BooksSearch.vue";
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
            {path:"/compare/second",component:CompareSecond},
        ]
    },
    {
        path: "/layout", component: Layout, children: [
            {path:"/tools/jian",component:Jian2Fan},
            {path:"/tools/yi",component:Yi2Fan},
            {path:"/tools/compare",component:BooksCompare},
            {path:"/tools/search",component:BooksSearch},
        ]
    },
    {
        path: "/layout", component: Layout, children: [
            {path:"/setting",component:Setting},
        ]
    },
    {
        path: '/preview',component: PreviewHtml
    }

];

// 3. 创建路由实例
const router = createRouter({
    // 4. 采用hash 模式
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
});

export default router

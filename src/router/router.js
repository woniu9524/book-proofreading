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
import TableView from "../views/tools/TableView.vue";
import TableSetting from "../views/setting/TableSetting.vue";
import BookRead from "../views/read/BookRead.vue";
import BookIndex from "../views/read/BookIndex.vue";
import MakeBook from "../views/tools/MakeBook.vue";
import ViewText from "../views/tools/compare/ViewText.vue";
import AllWordSetting from "../views/dict/allWord/AllWordSetting.vue";
import KeyWordSetting from "../views/dict/keyWord/KeyWordSetting.vue";
import AllWordShow from "../views/dict/allWord/AllWordShow.vue";

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
            {path:"/tools/table",component:TableView},
            {path:"/tools/make",component:MakeBook},
        ]
    },
    {
        path: "/layout", component: Layout, children: [
            {path:"/setting",component:Setting},
            {path:"/setting/table",component:TableSetting},
        ]
    },
    {
        path: "/layout", component: Layout, children: [
            {path:"/book/index",component:BookIndex},
            {path:"/book/read",component:BookRead},
        ]
    },
    {
        path: "/layout", component: Layout, children: [
            {path:"/dict/allWordSetting",component:AllWordSetting},
            {path:"/dict/keyWordSetting",component:KeyWordSetting},
            {path:"/dict/allWordShow",component:AllWordShow},

        ]
    },
    {
        path: '/preview',component: PreviewHtml
    },
    {path:"/table/viewText",component:ViewText},

];

// 3. 创建路由实例
const router = createRouter({
    // 4. 采用hash 模式
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
});

export default router

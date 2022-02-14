<template>

    <el-menu
            class="first-menu"
            mode="horizontal"
    >
        <el-menu-item index="1" @click="goIndex">返回书本列表</el-menu-item>
        <el-menu-item index="2" @click="openIntroduction">查找</el-menu-item>
        <el-menu-item index="3" @click="settingRank=true">书籍目录</el-menu-item>
        <el-menu-item index="4" @click="settingRank=true">删除本书</el-menu-item>
    </el-menu>

    <HtmlPage
            v-for="(arg,i) in htmlData"
            :html="arg.html"
            :diffTable="arg.diffList"
            :title="arg.title"
            :tips="arg.tips"
    >
    </HtmlPage>


</template>

<script>
    import {readBookFile} from "../../js/read/readBook";
    import HtmlPage from '../../components/read/page/index.vue'

    export default {
        name: "BookRead",
        components: {
            HtmlPage,
        },
        data() {
            return {
                bookID: '',
                htmlData: [],
            }
        },
        methods: {
            readBook() {
                let file = readBookFile(this.bookID)
                file.then((res) => {
                    if (res.type === 'article') {
                        this.htmlData.push(res.context)
                        console.log(this.htmlData)
                    } else {

                    }
                })
            },
            goIndex(){
                this.$router.push('/book/index')
            }

        },
        mounted() {
            this.bookID = this.$route.query.bookId
            this.readBook()
        }
    }
</script>

<style scoped>

</style>

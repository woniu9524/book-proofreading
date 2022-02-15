<template>

    <el-menu
            class="first-menu"
            mode="horizontal"
    >
        <el-menu-item index="1" @click="goIndex">返回书本列表</el-menu-item>
        <el-menu-item index="2" @click="dialogVisible=true">查找</el-menu-item>
        <el-menu-item index="3" @click="deleteBook">删除本书</el-menu-item>
        <el-menu-item index="4" @click="catalogueDrawer=true">书籍目录</el-menu-item>
        <el-menu-item index="5" @click="subPage">上一页</el-menu-item>
        <el-menu-item index="6" @click="addPage">下一页</el-menu-item>
    </el-menu>

    <HtmlPage
            :html="htmlData[page].html"
            :diffTable="htmlData[page].diffList"
            :title="htmlData[page].title"
            :tips="htmlData[page].tips"
            :keyWord="keyword"
            v-if="showHtml"
    >
    </HtmlPage>
    <el-drawer v-model="catalogueDrawer" title="目录" size="20%">
        <el-button type="text" @click="updatePage(i)" v-for="(item,i) in htmlData" style="display: block;margin: 10px">
            {{item.order}}.{{item.title}}
        </el-button>
    </el-drawer>

    <el-dialog v-model="dialogVisible" title="查找">
        <el-input v-model="keyword" placeholder="输入查找内容" />
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="searchText"
            >查找</el-button
            >
          </span>
        </template>
    </el-dialog>

</template>

<script>
    import {deleteBookById, readBookFile} from "../../js/read/readBook";
    import HtmlPage from '../../components/read/page/index.vue'
    import {ElMessageBox, ElMessage} from 'element-plus'

    export default {
        name: "BookRead",
        components: {
            HtmlPage,
        },
        data() {
            return {
                bookID: '',
                htmlData: [],
                page: 0,
                catalogueDrawer: false,
                dialogVisible:false,
                showHtml: true,
                keyword:'',
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
                        let json = JSON.parse(res.context)
                        this.htmlData = json.book
                    }
                })
            },
            goIndex() {
                this.$router.push('/book/index')
            },
            searchText() {
                let num_count = 0;
                let color_elm = document.querySelectorAll("span");
                for (let i = 0; i < color_elm.length; i++) {
                    color_elm[i].style.backgroundColor = "";
                }
                if (window.find && window.getSelection) {
                    document.designMode = "on";
                    let sel = window.getSelection();
                    sel.collapse(document.body, 0);

                    while (window.find(this.keyword)) {
                        document.execCommand("HiliteColor", false, "yellow");
                        num_count += 1;
                    }
                    sel.collapseToStart();
                    document.designMode = "off";
                } else if (document.body.createTextRange) {
                    num_count += 1; //这个bug让我很迷惑，为啥chrome里input中会被记上，360中记录不上，但是input里也没有被高亮啊，奇怪
                    let textRange = document.body.createTextRange();
                    while (textRange.findText(this.keyword)) {
                        textRange.execCommand("BackColor", false, "yellow");
                        num_count += 1;
                        textRange.collapse(false);
                    }
                }
                if (this.keyword !== "") {
                    ElMessage({
                        type: 'success',
                        message:this.keyword + "一共出现:" + num_count + "次",
                    })
                }
                this.dialogVisible=false
            },
            deleteBook() {
                ElMessageBox.confirm(
                    '确定要删除这本书吗？',
                    'Warning',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )
                    .then(() => {
                        deleteBookById(this.bookID)
                        this.goIndex()
                        ElMessage({
                            type: 'success',
                            message: 'Delete completed',
                        })
                    })
                    .catch(() => {
                        ElMessage({
                            type: 'info',
                            message: 'Delete canceled',
                        })
                    })

            },
            addPage() {
                if (this.page < this.htmlData.length - 1) {
                    this.page++
                } else {
                    ElMessage({
                        message: '已经到底了~',
                        type: 'warning',
                    })
                }
            },
            subPage() {
                if (this.page > 0) {
                    this.page--
                } else {
                    ElMessage({
                        message: '已经到底了~',
                        type: 'warning',
                    })
                }
            },
            updatePage(index) {
                this.page = index
                this.catalogueDrawer = false
            },


        },
        created() {
            this.bookID = this.$route.query.bookId
            this.readBook()
        }
    }
</script>

<style scoped>

</style>

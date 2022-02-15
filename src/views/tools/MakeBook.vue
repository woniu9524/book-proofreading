<template>
    <!--上传组件-->
    <div class="upload-part">
        <el-upload
                class="upload-demo"
                drag
                multiple
                :auto-upload="false"
                accept=".article"
                :on-change="handleChange"
                :show-file-list="false"
        >
            <el-icon class="el-icon--upload">
                <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
                <span style="font-style: inherit;color: red">拖拽</span>或<span
                    style="font-style: inherit;color: deepskyblue">点击</span>上传章节文件
                <p>拖入多个章节，将其封装成书</p>
            </div>
        </el-upload>
    </div>
    <div style="text-align: center;margin-top: 10px;">
        <div style="width: 300px;margin:10px auto">
            <el-input v-model="bookName" placeholder="输入书籍名称"  />
        </div>
        <el-button type="primary" round size="large" :disabled="articleList.length===0&&bookName===''" @click="makeBook">&emsp;&emsp;&emsp;封 装 成 书&emsp;&emsp;&emsp;
        </el-button>
    </div>
</template>

<script>
    import {UploadFilled} from '@element-plus/icons-vue'
    import {ElNotification} from "element-plus";

    export default {
        components: {
            UploadFilled,
        },
        data() {
            return {
                articleList: [],
                bookName:'',
            }
        },
        methods: {
            handleChange(fileInfo) {
                const that = this
                const filename = fileInfo.raw.name;//文件名
                let reader = new FileReader();//新建一个FileReader
                reader.readAsText(fileInfo.raw, "UTF-8");//读取文件
                reader.onload = function (evt) { //读取完文件之后会回来这
                    let fileString = evt.target.result; // 读取文件内容
                    that.articleList.push(JSON.parse(fileString))
                    ElNotification({
                        title: 'Success',
                        message: filename + '，已添加~',
                        type: 'success',
                    })

                }
            },
            makeBook(){
                this.orderRank()
                const ipc = require('electron').ipcRenderer
                ipc.send('saveBook',JSON.stringify(JSON.stringify({"book":this.articleList,"bookName":this.bookName})))

            },
            orderRank(){
                this.articleList.sort(((a, b) => {
                    return a.order-b.order;
                }))

            }

        }
    }

</script>

<style scoped>
    .upload-part {
        width: 500px;
        height: 200px;
        margin: 100px auto 10px auto;
        text-align: center;
    }
</style>

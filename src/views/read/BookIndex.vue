<template>
    <div>
        <BookCover :book-name="item.title" :book-id="item.id" :url="item.imageName" v-for="(item,i) in bookList"></BookCover>
        <el-card :body-style="{ padding: '0px' }" class="upload-card">
            <el-upload
                    class="avatar-uploader upload-image"
                    :show-file-list="false"
                    :before-upload="beforeUploadCover"
            >
                <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
                <el-icon v-else class="avatar-uploader-icon">
                    <plus/>
                </el-icon>
            </el-upload>

            <el-upload
                    style="margin: auto;text-align: center"
                    :before-upload="beforeUploadBook"
                    accept=".article,.book"

            >
                <el-button type="text">上传书本/文章内容</el-button>

            </el-upload>
            <div style="text-align: center">

            </div>
        </el-card>
    </div>

</template>

<script>
    import BookCover from '../../components/read/bookCover/index.vue'
    import {ElMessage} from 'element-plus'
    import {Plus} from '@element-plus/icons-vue'
    import axios from "axios";

    const low = require('lowdb');
    const FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择
    const adapter = new FileSync('./DATAS/bookIndex.json'); // 申明一个适配器
    const db = low(adapter);
    export default {
        name: "BookIndex",
        components: {
            BookCover,
            Plus
        },
        data() {
            return {
                imageUrl: '',
                imagePath: '',
                imageName: '',
                bookList:[],
            }
        },
        methods: {
            beforeUploadCover(file) {
                const isJPG = file.type === 'image/jpeg'
                const isLt10M = file.size / 1024 / 1024 < 10
                if (!isJPG) {
                    ElMessage.error('该文件不是图片类型，封面需要的是图片类型（封面可以不上传）')
                } else if (!isLt10M) {
                    ElMessage.error('图片大小不能超过10M')
                } else {
                    this.imageUrl = URL.createObjectURL(file)
                    this.imagePath=file.path
                    this.imageName=new Date().getTime().toString()+file.name
                }

                return isJPG && isLt10M
            },
            beforeUploadBook(file) {
                const fileName = new Date().getTime().toString()+file.name
                const filePath = file.path
                let type
                if (fileName.indexOf('.article') > -1) {
                    type = 'article'
                } else if (fileName.indexOf('.book' )> -1) {
                    type = 'book'
                } else {
                    ElMessage.error('类型不符合！')
                    return false
                }
                this.addImage()
                this.addBook(fileName, filePath)
                //建立关系表
                let reader = new FileReader()
                reader.readAsText(file)
                reader.onload = (e) => {
                    // 读取文件内容
                    const fileString = e.target.result
                    // 接下来可对文件内容进行处理
                    let json
                    let title
                    if(type==='article'){
                        json=JSON.parse(fileString)
                        title=json.title
                    }else{
                        json=JSON.parse(JSON.parse(fileString))
                        title=json.bookName
                    }


                    db.get('index')
                        .push({
                            "id": new Date().getTime(),
                            "title": title===""?"无":title,
                            "bookName": fileName,
                            "imageName": this.imageName===''?'default.png':this.imageName,
                            "type": type
                        })
                        .write()
                    ElMessage.success("添加完成")
                    this.readBookList()
                    this.$router.go(0)
                }

            },
            //上传图片
            addImage() {
                if (this.imagePath !== '' && this.imageName !== '') {
                    let url = 'http://localhost:4000/uploadBookImage'
                    axios
                        .get(url, {
                            params: {
                                'imagePath': this.imagePath,
                                'imageName': this.imageName
                            }
                        })
                }
            },
            addBook(fileName, filePath) {
                let url = 'http://localhost:4000/uploadBook'
                axios
                    .get(url, {
                        params: {
                            'bookPath': filePath,
                            'bookName': fileName
                        }
                    })
            },
            //读取所以数据
            readBookList(){
                this.bookList=db.get('index').value()
                this.imageUrl=''
                this.imageName=''
                this.imagePath=''
            },
        },
        mounted(){
            this.readBookList()
        }
    }
</script>


<style>
    .upload-card {
        width: 200px;
        height: 250px;
        margin: 20px 20px 20px 20px;
        display: inline-block;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }

    .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 200px;
        height: 210px;
        text-align: center;
        margin: auto;
    }

    .avatar {
        width: 100%;
        height: 210px;
        display: block;
    }
</style>

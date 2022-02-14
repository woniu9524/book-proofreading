<template>
    <div>
        <BookCover :book-name="name" v-for="(item,i) in list" url="src/assets/bookCovers/初学记.jpg"></BookCover>
        <el-card :body-style="{ padding: '0px' }" class="upload-card">
            <el-upload
                    class="avatar-uploader upload-image"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
            >
                <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
                <el-icon v-else class="avatar-uploader-icon">
                    <plus/>
                </el-icon>

            </el-upload>
            <div style="text-align: center">
                <el-button type="text">上传书本/文章内容</el-button>
            </div>
        </el-card>
    </div>

</template>

<script>
    import BookCover from '../../components/read/bookCover/index.vue'
    import {ElMessage} from 'element-plus'
    import {Plus} from '@element-plus/icons-vue'

    export default {
        name: "BookIndex",
        components: {
            BookCover,
            Plus
        },
        data() {
            return {
                name: '初学记',
                list: [1, 2, 3, 4, 5, 6],
                imageUrl: '',
            }
        },
        methods: {

            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg'
                const isLt10M = file.size / 1024 / 1024 < 10

                if (!isJPG) {
                    ElMessage.error('该文件不是图片类型，封面需要的是图片类型（封面可以不上传）')
                } else if (!isLt10M) {
                    ElMessage.error('图片大小不能超过10M')
                } else {
                    this.imageUrl = URL.createObjectURL(file)

                }

                return isJPG && isLt10M
            }
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

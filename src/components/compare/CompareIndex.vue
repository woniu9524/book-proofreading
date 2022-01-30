<template>
    <div id="compare-index">
        <el-upload
                class="upload-demo"
                drag
                multiple
                :auto-upload="false"
                :file-list="file_list"
                accept=".txt"
                :on-change="handleChange"
                limit="2"

        >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                拖拽或者点击上传文本
            </div>
        </el-upload>
    </div>
</template>


<script>
    export default {
        name: "CompareIndex",
        data() {
            return{
                file_list:[],
                files:[]

            }
        },
        methods:{
            handleChange(fileInfo){
                var filename=fileInfo.raw.name;
                var filepath=fileInfo.raw.path;
                var reader = new FileReader();//新建一个FileReader
                reader.readAsText(fileInfo.raw, "UTF-8");//读取文件
                reader.onload = function(evt) { //读取完文件之后会回来这里
                    var fileString = evt.target.result; // 读取文件内容
                    console.log(fileString)
                }
            }
        }
    }
</script>
<style scoped>

</style>
<template>
    <div class="upload-body">
        <div class="upload-part">
            <el-upload
                    class="upload-demo"
                    drag
                    multiple
                    :auto-upload="false"
                    accept=".txt,.docx"
                    :on-change="handleBook1"
                    limit="2"
                    :show-file-list="false"
            >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                    <span style="font-style: inherit;color: red">拖拽</span>或<span style="font-style: inherit;color: deepskyblue">点击</span>上传校对的第一本书
                    <p>可上传多个文本</p>
                </div>
            </el-upload>
        </div>
        <span style="margin: 20px"></span>
        <div class="upload-part">
            <el-upload
                    class="upload-demo"
                    drag
                    multiple
                    :auto-upload="false"
                    accept=".txt,.docx"
                    :on-change="handleBook2"
                    limit="2"
                    :show-file-list="false"
            >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                    <span style="font-style: inherit;color: red">拖拽</span>或<span style="font-style: inherit;color: deepskyblue">点击</span>上传校对的第二本书
                    <p>可上传多个文本</p>
                </div>
            </el-upload>
        </div>
    </div>
    <!--按钮-->
    <div style="text-align: center;margin-top: 50px">
        <el-button type="success" round size="large" @click="startCompare">开 始 比 对</el-button>
    </div>
</template>

<script>
    import {UploadFilled} from "@element-plus/icons-vue";
    import {ElNotification} from "element-plus";
    import {compareAllSentence, getCharId, getInvertedIndex, readSentences} from "../../js/tools/textHandle";
    let mammoth = require("mammoth");
    export default {
        components:{
            UploadFilled,
        },
        name: "BooksCompare",
        data(){
            return{
                book1:[],
                book2:[],
            }
        },
        methods:{
            handleBook1(fileInfo){
                this.readData(fileInfo,1)
            },
            handleBook2(fileInfo){
                this.readData(fileInfo,2)
            },
            readData(fileInfo,flag){
                const filename=fileInfo.raw.name;//文件名
                const filepath=fileInfo.raw.path;//文件路径
                let fileString=''
                const that=this
                if(filename.indexOf('.docx')>-1){
                    let article={};
                    mammoth.extractRawText({path: filepath})
                        .then(function(result){
                            fileString = result.value; // The raw text
                            article['filename']=filename;
                            article['filepath']=filepath;
                            article['text']=fileString;
                            if(flag===1){
                                that.book1.push(article)
                            }else {
                                that.book2.push(article)
                            }
                            ElNotification({
                                title: 'Success',
                                message:  filename+'，已添加~',
                                type: 'success',
                            })
                        }).done();
                }else {
                    let reader = new FileReader();//新建一个FileReader
                    reader.readAsText(fileInfo.raw, "UTF-8");//读取文件
                    reader.onload = function(evt) { //读取完文件之后会回来这
                        fileString = evt.target.result; // 读取文件内容
                    }
                    let article={};
                    article['filename']=filename;
                    article['filepath']=filepath;
                    article['text']=fileString;
                    if(flag===1){
                        this.book1.push(article)
                    }else {
                        this.book2.push(article)
                    }
                    ElNotification({
                        title: 'Success',
                        message:  filename+'，已添加~',
                        type: 'success',
                    })
                }
            },
            startCompare(){
                let charTables=getCharId(this.book1,this.book2)//charsMap的value是idfList[i]
                let indexObj=getInvertedIndex(this.book2,charTables.charsMap)//获取倒排索引表【字id：【句子id】】indexMap和sentences(句子和句子id)
                let sentences1=readSentences(this.book1)
                let sentences2=indexObj.sentences
                compareAllSentence(sentences1,sentences2,indexObj.indexMap,charTables)

            },
        }
    }
</script>

<style scoped>
    .upload-body{
        margin-top: 60px;
        text-align: center;
    }
    .upload-part{
        display: inline-block;
    }
</style>

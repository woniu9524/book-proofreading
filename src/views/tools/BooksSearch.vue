<template>
    <div class="search-box">
        <el-input
                v-model="searchInput"
                class="w-50 m-2 search-input"
                size="large"
                placeholder="输入查找内容"
        ></el-input>
        <span style="margin: 0 2px"></span>
        <el-button class="search-btn" type="primary" size="large" @click="searchBooks">搜索</el-button>
        <el-button size="large" class="setting-btn" @click="settingDialog=true">设置</el-button>
        <!--设置对话框-->
        <el-dialog v-model="settingDialog" title="设置" class="setting-dialog" width="200px">
            <el-form ref="setting">
                <el-form-item label="忽略简体繁体">
                    <el-switch v-model="setting.ignoreFanTi"></el-switch>
                </el-form-item>
                <el-form-item label="忽略繁体异体">
                    <el-switch v-model="setting.ignoreYiTi"></el-switch>
                </el-form-item>
                <el-form-item label="忽略自定义表">
                    <el-switch v-model="setting.ignoreCustom"></el-switch>
                </el-form-item>
                <el-form-item label="显示数量">
                    <el-input v-model="setting.top" placeholder="Please input"/>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
    <div class="upload-box">
        <el-upload
                class="upload-demo"
                drag
                multiple
                :auto-upload="false"
                accept=".txt,.docx"
                :on-change="uploadBooks"
                :show-file-list="false"
        >
            <el-icon class="el-icon--upload">
                <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
                <span style="font-style: inherit;color: red">拖拽</span>或<span
                    style="font-style: inherit;color: deepskyblue">点击</span>上传校对的第一本书
                <p>可上传多个文本</p>
            </div>
        </el-upload>
        <div style="margin: 10px auto">
            <el-button type="success" round @click="clearBooks" :disabled="!needClear">清 除 上 传 内 容</el-button>
        </div>
    </div>
</template>


<script>
    import {ElNotification} from "element-plus";
    import {UploadFilled} from "@element-plus/icons-vue";
    import {compareOne, getCharId, getInvertedIndex, readSentences} from "../../js/tools/textHandle";

    export default {
        name: "BooksSearch",
        components: {
            UploadFilled,
        },
        data() {
            return {
                searchInput: '',
                books: [],
                search:[],
                needClear:false,
                setting: {
                    ignoreCustom: false,
                    ignoreFanTi: false,
                    ignoreYiTi: false,
                    ignoreThreshold:true,
                    top: 30,
                },
                compareList:[],
                settingDialog:false,
            }
        },
        methods: {
            uploadBooks(fileInfo) {
                this.readData(fileInfo)
            },
            clearBooks() {
                this.books = []
            },
            searchBooks(){
                this.search=[{'filename':'','filepath':'','text':this.searchInput}]
                let charTables = getCharId(this.search, this.books)//charsMap的value是idfList[i]
                let indexObj = getInvertedIndex(this.books, charTables.charsMap)//获取倒排索引表【字id：【句子id】】indexMap和sentences(句子和句子id)
                let sentences1 = readSentences(this.search)
                let sentences2 = indexObj.sentences
                let sentenceFilenameMap1 = []//句子id和句子所在文件名的映射关系
                let sentenceFilenameMap2 = []//句子id和句子所在文件名的映射关系
                sentences1.forEach((sentenceObj) => {
                    sentenceFilenameMap1[sentenceObj.id] = sentenceObj.sentenceDic.filename
                })
                sentences2.forEach((sentenceObj) => {
                    sentenceFilenameMap2[sentenceObj.id] = sentenceObj.sentenceDic.filename
                })
                //开始比较
                sentences1.forEach((sentenceObj, i) => {
                    let compareRes = compareOne(sentenceObj.sentenceDic.sentence, sentences2, indexObj.indexMap, charTables, this.setting)
                    compareRes.forEach((line) => {
                        this.compareList.push({
                            'originFileName': sentenceFilenameMap1[sentenceObj.id],
                            'origin': sentenceObj.sentenceDic.sentence,
                            'compareFileName': sentenceFilenameMap2[line.sentenceId],
                            'compare': line.sentence,
                            'cos': line.cos
                        })
                    })
                    // this.percentage = ((i / sentences1.length) * 100).toFixed(0)
                })
                // console.log(this.compareList)
                this.$router.push({path:'/tools/table',query: {'table':JSON.stringify(this.compareList),'flag':'search','books':JSON.stringify(this.books)}})
            },
            readData(fileInfo) {
                const filename = fileInfo.raw.name;//文件名
                const filepath = fileInfo.raw.path;//文件路径
                let fileString = ''
                const that = this
                if (filename.indexOf('.docx') > -1) {
                    let article = {};
                    mammoth.extractRawText({path: filepath})
                        .then(function (result) {
                            fileString = result.value; // The raw text
                            article['filename'] = filename;
                            article['filepath'] = filepath;
                            article['text'] = fileString;
                            if (flag === 1) {
                                that.book1.push(article)
                            } else {
                                that.book2.push(article)
                            }
                            ElNotification({
                                title: 'Success',
                                message: filename + '，已添加~',
                                type: 'success',
                            })
                        }).done();
                } else {
                    let reader = new FileReader();//新建一个FileReader
                    reader.readAsText(fileInfo.raw, "UTF-8");//读取文件
                    reader.onload = function (evt) { //读取完文件之后会回来这
                        fileString = evt.target.result; // 读取文件内容
                        let article = {};
                        article['filename'] = filename;
                        article['filepath'] = filepath;
                        article['text'] = fileString;
                        that.books.push(article)
                    }
                    ElNotification({
                        title: 'Success',
                        message: filename + '，已添加~',
                        type: 'success',
                    })
                }
            },
        },
        watch:{
            books:{
                handler(newValue) {
                    if(newValue.length>0){
                        this.needClear=true
                    }else{
                        this.needClear=false
                    }
                },
                deep: true

            },
        },
        mounted() {
            let books=this.$route.query.books
            if(typeof (books)!=="undefined"){
                this.books=JSON.parse(books)
            }
        }
    }
</script>

<style scoped>
    .search-box {
        margin: 120px auto 10px auto;
        text-align: center;
    }

    .search-input {
        display: inline-block;
        width: 400px;
    }
    .setting-btn{
        display: inline-block;
        border: 1px solid dodgerblue;
    }

    .search-btn {
        display: inline-block;
        border: 1px solid dodgerblue;
        border-radius: 0px 25px 25px 0px;
    }

    >>> input.el-input__inner {
        border: 1px solid dodgerblue;
        border-radius: 25px 0 0 25px;
    }

    .upload-box {
        margin-top: 50px;
        text-align: center;
    }
</style>

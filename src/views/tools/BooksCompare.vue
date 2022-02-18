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
                    :show-file-list="false"
            >
                <el-icon class="el-icon--upload">
                    <upload-filled/>
                </el-icon>
                <div class="el-upload__text">
                    <span style="font-style: inherit;color: red">拖拽</span>或<span
                        style="font-style: inherit;color: deepskyblue">点击</span>上传校对的第二本书
                    <p>可上传多个文本</p>
                </div>
            </el-upload>
        </div>
    </div>
    <!--按钮-->
    <div style="text-align: center;margin-top: 50px">
        <el-button type="primary" round size="large" @click="settingDialog=true"> 设 置</el-button>
        <span style="margin: 0 10px 0 10px"></span>
        <el-button type="success" round size="large" @click="startCompare" :disabled="!btnCanBeClick">开 始 比 对
        </el-button>
        <span style="margin: 0 10px 0 10px"></span>
        <el-upload
                style="display: inline-block;"
                multiple
                :auto-upload="false"
                accept=".xlsx"
                :on-change="importExcel"
                :show-file-list="false"
        >
            <el-button round size="large">导入excel表</el-button>
        </el-upload>
        <span style="margin: 0 10px 0 10px"></span>
        <el-upload
                style="display: inline-block;"
                multiple
                :auto-upload="false"
                accept=".compare"
                :on-change="importCompare"
                :show-file-list="false"
        >
            <el-button round size="large">导入excel表+详情</el-button>
        </el-upload>

    </div>
    <div style="text-align: center;margin-top: 15px;" v-show="!btnCanBeClick">比对中……</div>
    <!--设置对话框-->
    <el-dialog v-model="settingDialog" title="设置" class="setting-dialog" width="200px">
        <el-form ref="rankSetting">
            <el-form-item label="忽略简体繁体">
                <el-switch v-model="setting.ignoreFanTi"></el-switch>
            </el-form-item>
            <el-form-item label="忽略繁体异体">
                <el-switch v-model="setting.ignoreYiTi"></el-switch>
            </el-form-item>
            <el-form-item label="忽略自定义表">
                <el-switch v-model="setting.ignoreCustom"></el-switch>
            </el-form-item>
            <el-form-item label="筛选阈值">
                <el-input v-model="setting.threshold" placeholder="Please input"/>
            </el-form-item>
            <el-form-item label="比较深度">
                <el-input v-model="setting.top" placeholder="Please input"/>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import {UploadFilled} from "@element-plus/icons-vue";
    import {ElNotification} from "element-plus";
    import {
        compareOne,
        getCharId,
        getInvertedIndex,
        readSentences
    } from "../../js/tools/textHandle";
    import {readExcel} from "../../js/tools/excelDo";
    const fs = require('fs');
    let mammoth = require("mammoth");
    export default {
        components: {
            UploadFilled,
        },
        name: "BooksCompare",
        data() {
            return {
                book1: [],
                book2: [],
                btnCanBeClick: true,
                settingDialog: false,
                setting: {
                    ignoreCustom: false,
                    ignoreFanTi: false,
                    ignoreYiTi: false,
                    threshold: 0.5,
                    top: 3,
                },
                compareList: [],
            }
        },
        methods: {
            handleBook1(fileInfo) {
                this.readData(fileInfo, 1)
            },
            handleBook2(fileInfo) {
                this.readData(fileInfo, 2)
            },
            readData(fileInfo, flag) {
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
                        if (flag === 1) {
                            that.book1.push(article)
                        } else {
                            that.book2.push(article)
                        }
                    }

                    ElNotification({
                        title: 'Success',
                        message: filename + '，已添加~',
                        type: 'success',
                    })
                }
            },
            startCompare() {
                let charTables = getCharId(this.book1, this.book2)//charsMap的value是idfList[i]
                let indexObj = getInvertedIndex(this.book2, charTables.charsMap)//获取倒排索引表【字id：【句子id】】indexMap和sentences(句子和句子id)
                let sentences1 = readSentences(this.book1)
                let sentences2 = indexObj.sentences
                let sentenceFilenameMap1 = []//句子id和句子所在文件名的映射关系
                let sentenceFilenameMap2 = []//句子id和句子所在文件名的映射关系
                sentences1.forEach((sentenceObj) => {
                    sentenceFilenameMap1[sentenceObj.id] = sentenceObj.sentenceDic.filename
                })
                sentences2.forEach((sentenceObj) => {
                    // sentenceFilenameMap2.push({'id':sentenceObj.id,'filename':sentenceObj.sentenceDic.filename})
                    sentenceFilenameMap2[sentenceObj.id] = sentenceObj.sentenceDic.filename
                })
                //开始比较
                this.btnCanBeClick = false
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
                this.$router.push({path: '/tools/table', query: {'table': JSON.stringify(this.compareList),'book1':JSON.stringify(this.book1),'book2':JSON.stringify(this.book2)}})
            },
            importExcel(fileInfo) {
                const filepath = fileInfo.raw.path;//文件路径
                let excelTable= readExcel(filepath)
                let resList=[]
                excelTable.forEach((line,i,arr)=>{
                    if (i>0){
                        resList.push({
                            'originFileName': line[0],
                            'origin': line[1],
                            'compareFileName':line[2],
                            'compare': line[3],
                            'cos': line[4]
                        })
                    }
                })

                this.$router.push({path: '/tools/table', query: {'table': JSON.stringify(resList)}})
            },
            importCompare(fileInfo) {
                const filepath = fileInfo.raw.path;//文件路径
                let data = fs.readFileSync(filepath, 'utf-8')
                let jsonData=JSON.parse(data)
                this.$router.push({path: '/tools/table', query: {'table': JSON.stringify(jsonData.table),'bookList1':JSON.stringify(jsonData.bookList1),'bookList2':JSON.stringify(jsonData.bookList2)}})
            }

        }
    }
</script>

<style scoped>
    .upload-body {
        margin-top: 120px;
        text-align: center;
    }

    .upload-part {
        display: inline-block;
    }

    .progress-style {
        width: 800px;
        margin: 30px auto;
    }
</style>

<template>
    <el-card class="generate-form">
        <template #header>
            <div class="card-header">
                <span>生成结果</span>
            </div>
        </template>
        <el-form ref="formRef" :model="form" label-width="120px">
            <el-form-item label="篇章标题">
                <el-input v-model="form.title" placeholder="填写一个标题"></el-input>
            </el-form-item>
            <el-form-item label="篇章序号">
                <el-input v-model="form.order" placeholder="填写一个数字"></el-input>
            </el-form-item>
            <el-form-item label="校对配置">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="忽略标点符号">
                            <el-switch v-model="highlightSetting.ignoreSign"></el-switch>
                        </el-form-item>
                        <el-form-item label="忽略简体繁体">
                            <el-switch v-model="highlightSetting.ignoreFanTi"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="忽略繁体异体">
                            <el-switch v-model="highlightSetting.ignoreYiTi"></el-switch>
                        </el-form-item>
                        <el-form-item label="忽略自定义表">
                            <el-switch v-model="highlightSetting.ignoreCustom"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="方式选择">
                <el-radio-group v-model="form.mergeType">
                    <el-radio label="diff">只合并不同(推荐)</el-radio>
                    <el-radio label="all">合并不同+多余</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="提示格式">
                    <el-input v-model="form.tips" placeholder="填写一个提示的格式"></el-input>
            </el-form-item>
            <div style="margin: auto;padding-left: 60px">
                <el-button type="warning" @click="introduceDrawer=true">说明</el-button>
                <el-button type="primary" @click="previewText">预览</el-button>
                <el-button type="success" @click="generateText">生成</el-button>
            </div>
        </el-form>
    </el-card>
    <!--说明抽屉-->
    <el-drawer v-model="introduceDrawer" title="说明">
        <div>
            <p></p>
        </div>
        <!--TODO 说明没写完-->
    </el-drawer>
</template>

<script>
    import {useProfileStore} from "../../store";
    import {storeToRefs} from "pinia";
    import {mergeHtml, mergeTexts} from "../../js/compare/mergeText";
    const ipc = require('electron').ipcRenderer
    export default {
        name: "CompareSecond",
        data(){
            return{
                form:{
                    title:"",
                    order:"",
                    mergeType:"diff",
                    tips:'{原文} 的校对异文是 {异文}'
                },
                highlightSetting:{
                    ignoreCustom:false,
                    ignoreFanTi:false,
                    ignoreYiTi:false,
                    ignoreSign:true,
                },
                resList:[],
                introduceDrawer:false,
            }
        },
        methods:{
            generateHtml(){
                let htmlList=[]
                let diffList=[]
                let temp=[]
                this.resList.forEach((line,i,arr)=>{
                    if(i===0||arr[i-1][0][0]!==arr[i][0][0]){
                        //当段落序号发生变化时
                        if(i!==0){
                            htmlList.push(temp)
                            temp=[]
                        }
                    }
                    // console.log(this.mergeType)
                    let htmlObj=mergeTexts(line[0][2],line[1][2],this.highlightSetting,this.form.mergeType)
                    temp.push(htmlObj.html)//添加html文本
                    //添加diff表
                    htmlObj.diffList.forEach((obj)=>{
                            diffList.push(obj)
                    })

                })
                htmlList.push(temp)
                let htmlText= mergeHtml(htmlList)
                let resObj={
                    'html':htmlText,
                    'diffList':diffList
                }
                /*let resText=htmlText+'\n||||||||||||||||||||||||||\n'+JSON.stringify(diffList)//将html和diff表组合
                return resText*/
                return resObj
            },
            previewText(){
                let resObj= this.generateHtml()
                resObj.title=this.form.title
                resObj.tips=this.form.tips
                localStorage.setItem('previewData',JSON.stringify(resObj))
                ipc.send('openPreview')
            },
            generateText(){
                let resObj= this.generateHtml()
                resObj.title=this.form.title
                resObj.tips=this.form.tips
                resObj.order=this.form.order
                ipc.send('saveArticle',JSON.stringify(resObj))
            }
        },
        mounted() {
            this.highlightSetting=JSON.parse(this.$route.query.ignore)
            this.resList=JSON.parse(this.$route.query.table)
        }
    }
</script>

<style scoped>
    .generate-form{
        width: 500px;
        margin: 80px auto;
        text-align: center;

        /*background-color: deepskyblue;*/
    }
    >>>.el-form--default{
       padding-right: 60px;
    }
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>

<template>
    <!--上传组件-->
    <div class="upload-part">
        <el-upload
                class="upload-demo"
                drag
                multiple
                :auto-upload="false"
                accept=".txt"
                :on-change="handleChange"
                limit="2"
                :show-file-list="false"
        >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                <span style="font-style: inherit;color: red">拖拽</span>或<span style="font-style: inherit;color: deepskyblue">点击</span>上传校对的两段文本
                <p>先上传底本，再上传用来校对的文本</p>
            </div>
        </el-upload>
    </div>
    <!--下一步-->
    <div style="text-align: center;margin-top: 10px;">
        <el-button type="primary" round size="large" :disabled="!nextCanBeClick" @click="goNext">&emsp;&emsp;&emsp;下 一 步&emsp;&emsp;&emsp;</el-button>
    </div>
    <!--用来分割文本的符号-->
    <div style="width: 250px;margin: 15px auto">
        <el-input v-model="splitInput" class="w-50 m-2" placeholder="Please Input" />
    </div>
</template>

<script>
    import { UploadFilled } from '@element-plus/icons-vue'
    import {ref,watch} from 'vue'
    import { ElNotification } from 'element-plus'
    import {useProfileStore} from '../../store'


    export default {
        components:{
            UploadFilled,
        },
        setup(){
            const profileStore = useProfileStore() // 获取到store的实例
            const splitInput=ref(profileStore.splitSign)//用来分割的的符号
            const nextCanBeClick=ref(false)//下一步按钮是否可以点击
            const count=ref(0)//记录添加文本的数量
            const nextFlag=ref(0)//是否允许下一步flag

            //上传文本时添加文本到article
            const handleChange=(fileInfo)=>{
                const filename=fileInfo.raw.name;//文件名
                const filepath=fileInfo.raw.path;//文件路径
                let reader = new FileReader();//新建一个FileReader
                reader.readAsText(fileInfo.raw, "UTF-8");//读取文件
                reader.onload = function(evt) { //读取完文件之后会回来这里
                    const fileString = evt.target.result; // 读取文件内容
                    if(count.value===0){
                        profileStore.articles=[]
                        let article1={};
                        article1['filename']=filename;
                        article1['filepath']=filepath;
                        article1['text']=fileString;
                        profileStore.articles.push(article1)
                        count.value++;
                        ElNotification({
                            title: 'Success',
                            message: '底稿：'+ filename+'，已添加~',
                            type: 'success',
                        })
                    }else if(count.value===1){
                        let article2={};
                        article2['filename']=filename;
                        article2['filepath']=filepath;
                        article2['text']=fileString;
                        profileStore.articles.push(article2)
                        ElNotification({
                            title: 'Success',
                            message: '校对文本：'+filename+'，已添加~',
                            type: 'success',
                        })
                        count.value++;
                        nextFlag.value=1;//可以进行下一步了
                    }
                }
            }

            //判断是否已经上传了两个文本
            watch(nextFlag, (newValue) => {
                if (newValue===1){
                    nextCanBeClick.value=true
                }
            })

            return{
                splitInput,
                nextCanBeClick,
                count,
                nextFlag,
                handleChange,
            }
        },
        methods:{
            //下一步
            goNext(){
                const profileStore = useProfileStore() // 获取到store的实例
                profileStore.splitSign=this.splitInput;
                this.$router.push({path:'/compare/first',query: {'splitSign':this.splitInput}})
            }
        },

    }

</script>

<style scoped>
    .upload-part{
        width: 500px;
        height: 200px;
        margin: 100px auto 10px auto;
        text-align: center;
    }
</style>
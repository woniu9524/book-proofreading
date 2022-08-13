<template>
  <!--上传组件-->
  <div class="upload-part">
    <el-upload
        class="upload-demo"
        drag
        multiple
        :auto-upload="false"
        accept=".txt,.docx"
        :on-change="handleChange"
        limit="2"
        :show-file-list="false"
    >
      <el-icon class="el-icon--upload">
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text">
        <span style="font-style: inherit;color: red">拖拽</span>或<span
          style="font-style: inherit;color: deepskyblue">点击</span>上传文本(.txt或.docx)
      </div>
    </el-upload>
  </div>
  <!--下一步-->
  <div style="text-align: center;margin-top: 10px;">
    <el-button type="primary" round size="large" :disabled="!nextCanBeClick" @click="goNext">&emsp;&emsp;&emsp;下 一 步&emsp;&emsp;&emsp;</el-button>
  </div>
  <el-form
      label-width="100px"
      :model="settingForm"
      style="max-width: 460px"
      :inline="true"
      class="setting-form"
  >
    <el-form-item label="分割文本符号">
      <!--用来分割文本的符号-->
      <el-input v-model="settingForm.splitInput" class="w-50 m-2" placeholder="Please Input"/>
    </el-form-item>
    <el-form-item label="过滤文本格式">
      <!--用来分割文本的符号-->
      <el-input v-model="settingForm.filterInput" class="w-50 m-2" placeholder="Please Input"/>
    </el-form-item>
    <el-form-item label="最短句子长度">
      <!--用来分割文本的符号-->
      <el-input v-model="settingForm.minLength" class="w-50 m-2" placeholder="Please Input"/>
    </el-form-item>
    <el-form-item label="移除无用字符">
      <!--用来分割文本的符号-->
      <el-input v-model="settingForm.removedInput" :rows="4" placeholder="Please Input" type="textarea"/>
    </el-form-item>
  </el-form>
</template>

<script>
import {UploadFilled} from '@element-plus/icons-vue'
import {ref, watch} from 'vue'
import {ElNotification} from 'element-plus'
import {useProfileStore} from '../../../store'
let mammoth = require("mammoth");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择

const adapter = new FileSync('./DATAS/config.json'); // 申明一个适配器
const db = low(adapter);
export default {
  components: {
    UploadFilled,
  },
  name: 'AllWordSetting',
  setup() {
    const profileStore = useProfileStore() // 获取到store的实例
    const nextCanBeClick = ref(false)//下一步按钮是否可以点击
    const nextFlag = ref(0)//是否允许下一步flag
    const settingForm = ref({
      splitInput: ref('，。？；'),
      filterInput: ref('（.）'),
      minLength: ref(0),
      removedInput: ref("1234567890.《》")
    })

    //上传文本时添加文本到article
    const handleChange = (fileInfo) => {
      const filename = fileInfo.raw.name;//文件名
      const filepath = fileInfo.raw.path;//文件路径
      let fileString = ''
      localStorage.removeItem("dictText");
      if (filename.indexOf('.docx') > -1) {
        mammoth.extractRawText({path: filepath})
            .then(function (result) {
              fileString = result.value; // The raw text
              profileStore.dictText = []
              let dictText = {};
              dictText['filename'] = filename;
              dictText['filepath'] = filepath;
              dictText['text'] = fileString;
              localStorage.setItem("dictText", fileString);
              profileStore.dictText.push(dictText)
              ElNotification({
                title: 'Success',
                message: '文本：' + filename + '，已添加~',
                type: 'success',
              })
              nextCanBeClick.value = true;
            }).done();
      } else {
        let reader = new FileReader();//新建一个FileReader
        reader.readAsText(fileInfo.raw, "UTF-8");//读取文件
        reader.onload = function (evt) { //读取完文件之后会回来这
          fileString = evt.target.result; // 读取文件内容
          profileStore.dictText = []
          let dictText = {};
          dictText['filename'] = filename;
          dictText['filepath'] = filepath;
          dictText['text'] = fileString;
          fileString=fileString.replace(/\[/g,'');
          fileString=fileString.replace(/]/g,'');
          localStorage.setItem("dictText", fileString);
          profileStore.dictText.push(dictText)
          ElNotification({
            title: 'Success',
            message: '文本：' + filename + '，已添加~',
            type: 'success',
          })
          nextCanBeClick.value = true;
        }

      }

    }


    return {
      nextCanBeClick,
      nextFlag,
      handleChange,
      settingForm,
    }
  },
  methods: {
    //下一步
    goNext() {
      db.set('textDict.filter',this.settingForm.filterInput).write()
      db.set('textDict.textSplit',this.settingForm.splitInput).write()
      db.set('textDict.minLength',this.settingForm.minLength).write()
      db.set('textDict.removed',this.settingForm.removedInput).write()
      this.$router.push({
        path: '/dict/allWordShow',
        query: {'settingForm': JSON.stringify(this.settingForm)}
      })
    },
    readConfig(){
      try {
        console.dir(db.__wrapped__.textDict)
        let filter=db.__wrapped__.textDict.filter
        let textSplit=db.__wrapped__.textDict.textSplit
        let minLength=db.__wrapped__.textDict.minLength
        let removed=db.__wrapped__.textDict.removed
        // debugger
        if(filter!=="undefined"&&filter.length>0){
          this.settingForm.filterInput=filter;
        }
        if(textSplit!=="undefined"&&textSplit.length>0){
          this.settingForm.splitInput=textSplit;
        }
        if(removed!=="undefined"&&removed.length>0){
          this.settingForm.removedInput=removed;
        }
        if(minLength!=="undefined"){
          this.settingForm.minLength=minLength;
        }
      }catch (e){

      }
    }
  },
  mounted(){
    this.readConfig();
  }

}

</script>

<style scoped>
.upload-part {
  width: 500px;
  height: 200px;
  margin: 60px auto 10px auto;
  text-align: center;
}

.setting-form {
  width: 300px;
  margin: 30px auto 10px auto;
}
</style>

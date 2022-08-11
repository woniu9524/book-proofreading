<template>
  <div style="margin:50px 20px 20px 0px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input
            v-model="keyword"
            :rows="12"
            type="textarea"
            placeholder="粘贴关键字/词"
        />
      </el-col>
      <el-col :span="12">
        <el-input
            v-model="text"
            :rows="12"
            type="textarea"
            placeholder="粘贴要处理的文本"
        />
      </el-col>
    </el-row>
  </div>
  <div style="text-align: center;margin-top: 10px;">
    <el-button type="primary" round size="large" @click="goNext">&emsp;&emsp;&emsp;下 一 步&emsp;&emsp;&emsp;
    </el-button>
  </div>
  <el-form
      label-width="120px"
      :model="settingForm"
      style="max-width: 460px"
      :inline="true"
      class="setting-form"
  >
    <el-form-item label="分割文本符号">
      <!--用来分割文本的符号-->
      <el-input v-model="settingForm.splitInput" class="w-50 m-2" placeholder="Please Input"/>
    </el-form-item>
    <el-form-item label="分割关键字符号">
      <!--用来分割keyword的符号-->
      <el-input v-model="settingForm.keywordSplitInput" class="w-50 m-2" placeholder="默认按照换行和空格"/>
    </el-form-item>
    <el-form-item label="最短句子长度">
      <!--用来分割文本的符号-->
      <el-input v-model="settingForm.minLength" class="w-50 m-2" placeholder="Please Input"/>
    </el-form-item>
  </el-form>
</template>

<script>
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择

const adapter = new FileSync('./DATAS/config.json'); // 申明一个适配器
const db = low(adapter);
export default {
  name: "KeyWordSetting",
  data() {
    return {
      text: "",
      keyword: "",
      settingForm: {
        splitInput: "，。；？",
        keywordSplitInput: "",
        minLength: 0,
      }
    }
  },
  methods: {
    goNext() {
      this.text=this.text.replace(/\[/g,'')
      this.text=this.text.replace(/]/g,'')
      localStorage.setItem("dictText", this.text);
      db.set('textDict.keywordSplit',this.settingForm.keywordSplitInput).write()
      db.set('textDict.textSplit',this.settingForm.splitInput).write()
      db.set('textDict.minLength',this.settingForm.minLength).write()
      this.$router.push({
        path: '/dict/keyWordShow',
        query: {
          settingForm: JSON.stringify(this.settingForm),
          text: this.text,
          keyword: this.keyword
        }
      })
    },
  },
  mounted() {
    try {
      let keywordSplit=db.__wrapped__.textDict.keywordSplit
      let textSplit=db.__wrapped__.textDict.textSplit
      let minLength=db.__wrapped__.textDict.minLength
      debugger
      if(keywordSplit!=="undefined"&&keywordSplit.length>0){
        this.settingForm.keywordSplitInput=keywordSplit;
      }
      if(textSplit!=="undefined"&&textSplit.length>0){
        this.settingForm.splitInput=textSplit;
      }
      if(minLength!=="undefined"){
        this.settingForm.minLength=minLength;
      }
    }catch (e){

    }
  }
}
</script>

<style scoped>
.setting-form {
  width: 300px;
  margin: 30px auto 10px auto;
}
</style>

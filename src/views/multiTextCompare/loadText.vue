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
</template>

<script>
import {UploadFilled} from '@element-plus/icons-vue'
import {ref, watch} from 'vue'
import {ElNotification} from 'element-plus'

let mammoth = require("mammoth");

export default {
  components: {
    UploadFilled,
  },
  name: 'loadText',
  setup() {
    const nextCanBeClick = ref(false)//下一步按钮是否可以点击
    const nextFlag = ref(0)//是否允许下一步flag
    const Texts = ref([])//文本内容

    const handleChange = (fileInfo) => {
      const filename = fileInfo.raw.name;//文件名
      const filepath = fileInfo.raw.path;//文件路径
      let fileString = ''
      if (filename.indexOf('.docx') > -1) {
        mammoth.extractRawText({path: filepath})
            .then(function (result) {
              fileString = result.value; // The raw text
              let dictText = {};
              dictText['filename'] = filename;
              dictText['filepath'] = filepath;
              dictText['text'] = fileString;
              Texts.value.push(dictText)
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
          let dictText = {};
          dictText['filename'] = filename;
          dictText['filepath'] = filepath;
          dictText['text'] = fileString;
          Texts.value.push(dictText)
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
      Texts,
    }
  },
  methods: {
    //下一步
    goNext() {
      if (this.Texts.length < 2) {
        ElNotification({
          title: 'Error',
          message: '请至少上传两个文本~',
          type: 'error',
        })
      } else {
        localStorage.removeItem('Texts')
        localStorage.setItem('Texts', JSON.stringify(this.Texts))
        this.$router.push({
          path: '/multi/compare',
          // query: {'settingForm': JSON.stringify(this.Texts)}
        })
      }

    },

  },
  mounted() {
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


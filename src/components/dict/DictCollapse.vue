<template>
  <el-row :gutter="5">
    <el-col :span="19">
      <div class="dict-collapse" id="dict-collapse">
        <el-collapse v-model="activeNames" :accordion="accordion" @change="handleChange">
          <el-collapse-item v-for="(item,index) in textDict" :title="item.name +' ['+ item.textList.length+']'"
                            :name="item.id" :id="item.name">
            <div v-if="needOpen">
                <p
                    v-for="(line,ind) in item.textList"
                    class="dict-line" :name="line"
                    @click="getTextView" v-html="line"
                    style="color: #3a8ee6;cursor:pointer;"
                />
            </div>
            <div v-else>
              <p v-for="(line,ind) in item.textList" class="dict-line" v-html="line"></p>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-col>
    <el-col :span="5">
      <el-affix>
        <div class="collapse-setting">
          <el-form label-width="120px">
            <el-form-item label="查看原文">
              <el-switch
                  v-model="needOpen"
              />
            </el-form-item>
            <el-form-item label="手风琴模式">
              <el-switch
                  v-model="accordion"
              />
            </el-form-item>
            <el-form-item label="关键字高亮">
              <el-switch
                  v-model="isHighLight"
              />
            </el-form-item>
            <el-input v-model="keyword" placeholder="输入要查询的字" style="width: 130px;"/>
            <el-button color="#409EFF" @click="outExcel" plain style="width: 130px;margin-top: 15px">导出表格
            </el-button>
            <el-button color="#409EFF" @click="goHead" plain style="width: 130px;margin: 15px 0 0 0">返回顶部</el-button>
          </el-form>

        </div>
      </el-affix>
    </el-col>
  </el-row>
</template>


<script>

const ipc = require('electron').ipcRenderer
ipc.on('saveDictEnd', () => {
  alert("导出完成！")
})
export default {
  name: "DictCollapse",
  props: {
    textDict: {type: Object, required: true, default: {}},
  },
  data() {
    return {
      activeNames: [],
      accordion: false,
      keyword: "",
      isHighLight: true,
      needOpen: false,
    }
  },
  methods: {
    searchWord(val) {
      let flag = 0;
      for (let index in this.textDict) {
        if (this.textDict[index].name === val) {
          this.activeNames = parseInt(index) + 1;
          flag = 1;
        }
      }
      if (flag === 1) {
        document.getElementById(val).scrollIntoView({block: "center", inline: "center"})
        this.handleChange();
      }

    },
    goHead() {
      document.getElementById(this.textDict[0].name).scrollIntoView({block: "center", inline: "center"})
    },
    handleChange() {
      //手风琴模式和正常模式不一样，一个是string一个是array
      let indexes = [];
      console.log(typeof (this.activeNames))
      if (typeof (this.activeNames) === "number") {
        indexes.push(this.activeNames)
      } else {
        indexes = this.activeNames;
      }
      indexes.forEach((i) => {
        let keyword = this.textDict[i - 1].name;
        let lines = this.textDict[i - 1].textList;
        //去除样式
        lines.forEach((line, index) => {
          lines[index] = line.replace(/<span class="highlight-text">.*?<\/span>/g, keyword)
        })
        //文本高亮
        if (this.isHighLight === true) {
          lines.forEach((line, index) => {
            lines[index] = line.replace(eval("/" + keyword + "/g"), '<span class="highlight-text">' + keyword + '</span>')
          })
        }
      })
    },
    outExcel() {
      let excelData = []
      this.textDict.forEach((obj) => {
        let tempList = []
        tempList.push(obj.name)
        obj.textList.forEach((line) => {
          tempList.push(line)
        })
        excelData.push(tempList)
      })
      debugger
      ipc.send('saveDictExcel', JSON.stringify(excelData))
    },
    getTextView(evt) {
      let keyLine = evt.target.innerText;
      localStorage.setItem("keyLine", keyLine);
      ipc.send('openDictViewText')
    }
  },
  mounted() {

  },
  watch: {
    keyword(newName, oldName) {
      if (newName.length === 1) {
        this.searchWord(newName);
      }
    }
  }

}
</script>

<style scoped>
.dict-collapse {
  margin-left: 20px;
}

.collapse-setting {
  /*margin-right: 20px;*/
  /*height: 300px;*/
  text-align: center;
}

>>> .highlight-text {
  background-color: #fbff00;
  display: inline-block;
  color: #f00;
  padding-left: 3px;
  padding-right: 3px;
  border-radius: 5px;
  border: 1px solid #ef6063;
}
</style>

<template>
  <el-row :gutter="5">
    <el-col :span="20">
      <div class="dict-collapse" id="dict-collapse">
        <el-collapse v-model="activeNames" :accordion="accordion" @change="handleChange">
          <el-collapse-item v-for="(item,index) in textDict" :title="item.name" :name="item.id" :id="item.name">
            <p v-for="(line,ind) in item.textList" v-html="line"></p>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-col>
    <el-col :span="4">
      <el-affix>
        <div class="collapse-setting">
          <div class="open-accordion">
            <div>
              <el-button color="#409EFF" @click="goHead" plain style="width: 130px;">返回顶部</el-button>
            </div>
           <div>
             <div v-if="isHighLight">
               <el-button color="#409EFF" @click="isHighLight=!isHighLight" plain style="width: 130px;">关闭关键字高亮</el-button>
             </div>
             <div v-else>
               <el-button color="#409EFF" @click="isHighLight=!isHighLight" plain style="width: 130px;">打开关键字高亮</el-button>
             </div>
           </div>
            <div v-if="accordion">
              <el-button color="#626aef" @click="accordion=!accordion" style="width: 130px;" plain>关闭手风琴模式
              </el-button>
            </div>
            <div v-else>
              <el-button color="#67C23A" @click="accordion=!accordion" style="width: 130px;" plain>打开手风琴模式
              </el-button>
            </div>
          </div>
          <el-input v-model="keyword" placeholder="输入要查询的字" style="width: 130px;"/>
        </div>
      </el-affix>
    </el-col>
  </el-row>
</template>


<script>
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
    }
  },
  methods: {
    searchWord(val) {
      for (let index in this.textDict) {
        if (this.textDict[index].name === val) {
          this.activeNames = parseInt(index) + 1;
        }
      }
      document.getElementById(val).scrollIntoView({block: "center", inline: "center"})
      this.handleChange();

    },
    goHead() {
      document.getElementById(this.textDict[0].name).scrollIntoView({block: "center", inline: "center"})
    },
    handleChange() {
      //手风琴模式和正常模式不一样，一个是string一个是array
      let indexs = [];
      if (this.accordion === true) {
        indexs.push(this.activeNames)
      } else {
        indexs = this.activeNames;
      }
      indexs.forEach((i) => {
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
  margin-right: 20px;
  height: 300px;
  background-color: #00AD77;
  text-align: center;
}

>>> .highlight-text {
  background-color: #845EC2;
  display: inline-block;
  color: #F9F871;
  padding-left: 3px;
  padding-right: 3px;
  border-radius: 5px;
  border: 1px solid #D65DB1;
  text-decoration: none;
}
</style>

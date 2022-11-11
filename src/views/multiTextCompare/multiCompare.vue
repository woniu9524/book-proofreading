<template>
  <el-row>
    <el-form :model="form" label-width="120px" class="compare-setting-form">
      <el-form-item label="文本名">
        <div class="filename-box">
          <el-row v-for="i in Math.ceil(textNames.length/5)">
            <el-col :span="6" v-for="j in 4" v-show="textNames[(i-1)*5+j-1]!==undefined">
              <el-button
                  :key="j"
                  type="primary"
                  round
                  plain
                  style="width: 80%;"
              >
                {{ '(' + ((i - 1) * 5 + j) + ')：' + textNames[(i - 1) * 5 + j - 1] }}
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item label="停用词">
        <el-input v-model="form.stopWords" class="w-50 m-2" placeholder="Please Input"/>
      </el-form-item>
      <el-form-item label="组合方式">
        <el-checkbox-group v-model="checkList">
          <el-checkbox :label="o+1" v-for="o in combinationType">
            {{ 'C(' + (combinationType + 1) + ',' + (o + 1) + ')' }}
          </el-checkbox>
        </el-checkbox-group>
        <span v-show="this.combinationNum!==0" style="margin-left: 20px;padding-bottom: 10px">
          <el-button type="success" @click="genTable">{{ '生成' + combinationNum + "组对比" }}</el-button>
        </span>
      </el-form-item>
    </el-form>
  </el-row>
  <el-row>
    <el-tabs tab-position="left" style="width: 98%;">
      <el-tab-pane label="关系图">hello</el-tab-pane>
      <el-tab-pane :label="getBookId(obj.id)" v-for="obj in tableData" >
        <el-table :data="obj.data.slice((currentPage-1)*9,currentPage*9)" stripe style="width: 100%" height="420px">
          <el-table-column prop="equalWord" label="相同字" width="80px"/>
          <el-table-column prop="equalFrequency" label="出现次数" width="80px"/>
          <el-table-column prop="equalRate" label="出现占比"/>
          <el-table-column prop="diffWord" label="不同字" width="80px"/>
          <el-table-column prop="source" label="来源"/>
          <el-table-column prop="diffFrequency" label="出现次数" width="80px"/>
          <el-table-column prop="diffRate" label="出现占比"/>
        </el-table>
        <div class="split-page">
          <el-pagination
              v-model:currentPage="currentPage"
              page-size="9"
              layout="total, prev, pager, next"
              :total="obj.data.length"
          >
          </el-pagination>
        </div>
      </el-tab-pane>



    </el-tabs>
  </el-row>
</template>

<script>


import {genCombinationText, getIntersectionAndDiff} from "../../js/multiText/mutliUtil";

export default {
  name: 'multiCompare',
  data() {
    return {
      Texts: [],
      textNames: [],
      textData: [],
      combinationType: 2,
      combinationNum: 0,
      form: {
        stopWords: '，。',
      },
      checkList: [],
      tableData: [],
      combinationData: [],
      currentPage: 1,
    }
  },
  methods: {
    // 读取文本
    readText() {
      this.Texts = JSON.parse(localStorage.getItem('Texts'))
      this.Texts.forEach((item, index, array) => {
        array[index] = item.filename.replace('.txt', '').replace('.docx', '')
        this.textNames.push(item.filename.replace('.txt', '').replace('.docx', ''))
        this.textData.push(item.text)
        // this.textIds.push(index+1)
        this.combinationType = this.Texts.length - 1
      })
    },
    factorial(m, n) {
      let num = 1;
      let count = 0;
      for (let i = m; i > 0; i--) {
        if (count === n) {//当循环次数等于指定的相乘个数时，即跳出for循环
          break;
        }
        num = num * i;
        count++;
      }
      return num;

    },
    combination(m, n) {
      return this.factorial(m, n) / this.factorial(n, n);//就是Cmn(上面是n，下面是m) = Amn(上面是n，下面是m)/Ann(上下都是n)
    },
    genTable() {
      this.tableData=[]
      this.checkList.forEach((item) => {
            let idsList = genCombinationText(item, this.Texts.length)
            idsList.forEach((ids) => {
                  let res = getIntersectionAndDiff(ids, this.textData, this.form.stopWords)
                  let intersection = []
                  let diff = []
                  for (let words of res.intersection) {
                    // 遍历words集合
                    Object.keys(words).forEach((key, index) => {
                      intersection.push([key, words[key][0], words[key][1]])
                    })
                  }
                  for (let words of res.diff) {
                    Object.keys(words).forEach((key, index) => {
                      debugger
                      diff.push([key, words[key][0][0], words[key][0][1],words[key][1]])
                    })
                  }
                  this.combinationData.push({
                    id: ids,
                    intersection: intersection,
                    diff: diff,
                  })

                  let table = []
                  let length = intersection.length > diff.length ? intersection.length : diff.length
                  for (let i = 0; i < length; i++) {
                    let row = []
                    let temp = {}
                    if (intersection[i] !== undefined) {
                      temp = {
                        'equalWord': intersection[i][0],
                        'equalFrequency': intersection[i][1],
                        'equalRate': intersection[i][2],
                      }
                    } else {
                      temp = {'equalWord': '', 'equalFrequency': '', 'equalRate': ''}
                    }
                    if (diff[i] !== undefined) {
                      debugger
                      temp['diffWord'] = diff[i][0]
                      temp['diffFrequency'] = diff[i][1]
                      temp['diffRate'] = diff[i][2]
                      temp['source']=this.textNames[diff[i][3]]
                    } else {
                      temp['diffWord'] = ''
                      temp['diffFrequency'] = ''
                      temp['diffRate'] = ''
                      temp['source']=''
                    }
                    table.push(temp)
                  }
                  this.tableData.push({
                    id: ids,
                    data: table,
                  })
                  debugger
                }
            )
          }
      )
      console.log(this.tableData)
    },
    getBookId(ids){
      let strList=[]
      ids.forEach((id)=>{
        strList.push('('+(id+1)+')')
      })
      return strList.join('-')
    }
  },
  mounted() {
    this.readText();
  }
  ,
  watch: {
    checkList: function (val) {
      let num = 0;
      console.log(val)
      val.forEach((item) => {
        num += this.combination(this.Texts.length, item)
      })
      this.combinationNum = num
    }
  }

}

</script>

<style scoped>
.filename-box {
  width: 100%;
}

.compare-setting-form {
  width: 98%;
}


</style>

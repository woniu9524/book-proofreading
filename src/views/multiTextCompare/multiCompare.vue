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
        </span><span v-show="this.combinationNum!==0" style="margin-left: 20px;padding-bottom: 10px">
          <el-button type="primary" @click="outTable">{{ '导出' + combinationNum + "组对比" }}</el-button>
        </span>
      </el-form-item>
    </el-form>
  </el-row>
  <el-row>
    <el-tabs tab-position="left" style="width: 98%;">
      <el-tab-pane label="关系图">
        <MultiG6
            :graph-data="graphData"
            v-if="fresh"
        />
      </el-tab-pane>
      <el-tab-pane :label="getBookId(obj.id)" v-for="obj in tableData" >
        <div style="text-align: center">
          <el-tag v-for="i in obj.id" style="margin: 0px 10px 0px 10px">{{textNames[i]}}</el-tag>
        </div>
        <el-table :data="obj.data.slice((currentPage-1)*9,currentPage*9)" stripe style="width: 100%" height="420px">
          <el-table-column prop="equalWord" label="相同字" width="80px"/>
          <el-table-column prop="source1" label="来源" width="80px"/>
          <el-table-column prop="equalFrequency" label="出现次数" width="80px"/>
          <el-table-column prop="equalRate" label="出现占比"/>
          <el-table-column prop="diffWord" label="不同字" width="80px"/>
          <el-table-column prop="source2" label="来源"/>
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


import {genCombinationText, genMutliTextGraphData, getIntersectionAndDiff} from "../../js/multiText/mutliUtil";
import MultiG6 from "../../components/multiText/MultiG6.vue";
const ipc = require('electron').ipcRenderer
ipc.on('saveMultiExcelEnd', () => {
  alert("导出完成！")
})
export default {
  name: 'multiCompare',
  components: {MultiG6},
  data() {
    return {
      Texts: [],
      textNames: [],
      textData: [],
      combinationType: 2,
      combinationNum: 0,
      form: {
        stopWords: '!#$%&()*+,-./:;<=>?@[]^_`{|}~“”？，！•【】『』〖〗〔〕〈〉〔〕「」（）、。：；’‘……￥·●○§《》 　\t︰1234567890',
      },
      checkList: [],
      tableData: [],
      combinationData: [],
      graphData: [],
      currentPage: 1,
      fresh:false,
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
    genGraph(){
      let graphData=[]
      this.combinationData.forEach((item,index,array)=>{
        debugger
         if (item.ids.length===2){
           graphData.push(item)
         }
      })
      this.graphData=genMutliTextGraphData(graphData,this.textNames)
      this.fresh=true
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
                      intersection.push([key, words[key][0][0], words[key][0][1],words[key][1]])
                    })
                  }
                  for (let words of res.diff) {
                    Object.keys(words).forEach((key, index) => {
                      diff.push([key, words[key][0][0], words[key][0][1],words[key][1]])
                    })
                  }
                  this.combinationData.push({
                    ids: ids,
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
                        'source1':this.textNames[intersection[i][3]],
                      }
                    } else {
                      temp = {'equalWord': '', 'equalFrequency': '', 'equalRate': '', 'source1':''}
                    }
                    if (diff[i] !== undefined) {
                      temp['diffWord'] = diff[i][0]
                      temp['diffFrequency'] = diff[i][1]
                      temp['diffRate'] = diff[i][2]
                      temp['source2']=this.textNames[diff[i][3]]
                    } else {
                      temp['diffWord'] = ''
                      temp['diffFrequency'] = ''
                      temp['diffRate'] = ''
                      temp['source2']=''
                    }
                    table.push(temp)
                  }
                  this.tableData.push({
                    id: ids,
                    data: table,
                  })

                }
            )
          }
      )
      this.genGraph()
    },
    getBookId(ids){
      let strList=[]
      ids.forEach((id)=>{
        strList.push('('+(id+1)+')')
      })
      return strList.join('-')
    },
    outTable(){
      let table=[]
      console.log(this.tableData)
      if (this.tableData===[]){
        alert("请先生成表格！")
        return
      }
      this.tableData.forEach((item)=> {
        let bookNames = []
        item.id.forEach((id) => {
          bookNames.push(this.textNames[id])
        })
        // 制作表头1
        let sheet = []
        let title1 = []
        let title2 = []
        let sheetData = []
        for (let i = 0; i < bookNames.length * 2; i++) {
          for (let j = 0; j < 3; j++) {
            title1.push('')
          }
          if (i===0){
            title1.push('')
          }
        }
        title1[0] = '相同'
        title1[Math.floor((title1.length) / 2)+1] = '不同'
        // 制作表头2
        bookNames.forEach((name) => {
          title2.push(name)
          title2.push('出现次数')
          title2.push('出现占比')
        })
        title2.push('')
        bookNames.forEach((name) => {
          title2.push(name)
          title2.push('出现次数')
          title2.push('出现占比')
        })
        // 制作表格数据
        // item.data.forEach((row)=>{
        //   // table.push([row.equalWord,row.equalFrequency,row.equalRate,row.diffWord,row.diffFrequency,row.diffRate,row.source])
        //   sheetData.push(new Array(title1.length).fill(''))
        // })

          let group = this.getGroup(item.data, 'source1')
          Object.keys(group).forEach((key, i) => {
            group[key].forEach((row, index) => {
              if (sheetData[index] === undefined) {
                sheetData.push(new Array(title1.length).fill(''))
              }
              sheetData[index][i * 3] = row.equalWord
              sheetData[index][i * 3 + 1] = row.equalFrequency
              sheetData[index][i * 3 + 2] = row.equalRate
            })
          })

          let group2 = this.getGroup(item.data, 'source2')
          Object.keys(group2).forEach((key, i) => {
            group2[key].forEach((row, index) => {
              if (sheetData[index] === undefined) {
                sheetData.push(new Array(title1.length).fill(''))
              }
              sheetData[index][i * 3 + bookNames.length * 3+1] = row.diffWord
              sheetData[index][i * 3 + bookNames.length * 3 + 2] = row.diffFrequency
              sheetData[index][i * 3 + bookNames.length * 3 + 3] = row.diffRate
            })
          })
          sheetData.unshift(title1, title2)
          table.push({
            name: bookNames.join('-'),
            data: sheetData,
          })
        })

      debugger
      ipc.send('saveMultiExcel', JSON.stringify(table))

    },
    getGroup(data,key){
      let groups={};
      data.forEach(c=>{
        let value=c[key];
        groups[value]=groups[value]||[];
        groups[value].push(c);
      });
      return groups;
    },
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

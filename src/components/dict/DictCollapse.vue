<template>
  <el-row :gutter="5">
    <el-col :span="19">
      <div class="dict-collapse" id="dict-collapse">
        <el-collapse v-model="activeNames" :accordion="accordion" @change="handleChange">
          <el-collapse-item v-for="(item,index) in textDict" :name="item.id" :id="item.name">
            <template #title>
              <el-tag type="" effect="dark" style="min-width: 50px">{{ item.name }}</el-tag>
              <el-tag type="info" round style="min-width: 100px">{{
                  item.textList.length + '句，' + item.charCount + '次'
                }}
              </el-tag>
              <el-tag type="success" round style="min-width: 50px" v-show="zimuShow">{{ item.initial }}</el-tag>
            </template>

            <div v-if="needOpen">
              <!--              <p-->
              <!--                  v-for="(line,ind) in item.textList"-->
              <!--                  class="dict-line" :name="line"-->
              <!--                  @click="getTextView" v-html="line"-->
              <!--                  style="color: #3a8ee6;cursor:pointer;"-->
              <!--              />-->
              <div class="line-component dict-line" v-for="(arr,ind) in item.textList">
                <el-row :gutter="5">
                  <el-col :span="3" class="book-name">
                    <p style="text-align: center">{{ arr[2] }}</p>
                  </el-col>
                  <el-col :span="1" class="line-num">
                    <p>{{ arr[0] }}</p>
                  </el-col>

                  <el-col :span="20" class="line-text"
                          @dblclick="arr[1][1].isClicked=!arr[1][1].isClicked;dblclick(arr[1][1].isClicked,arr,item.name)">
                    <el-input
                        v-if="arr[1][1].isClicked"
                        v-model="textChangeInput"
                        :rows="2"
                        type="textarea"
                        style="text-align: center">
                    </el-input>
                    <p v-else v-html="arr[1][0]" :name="arr[1][0]" @click="getTextView"
                       style="color: #3a8ee6;cursor:pointer;"></p>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-else>
              <div class="line-component dict-line" v-for="(arr,ind) in item.textList">
                <el-row :gutter="5">
                  <el-col :span="3" class="book-name">
                    <p style="text-align: center">{{ arr[2] }}</p>
                  </el-col>
                  <el-col :span="1" class="line-num">
                    <p>{{ arr[0] }}</p>
                  </el-col>
                  <el-col :span="20" class="line-text"
                          @dblclick="arr[1][1].isClicked=!arr[1][1].isClicked;dblclick(arr[1][1].isClicked,arr,item.name)">
                    <el-input
                        v-if="arr[1][1].isClicked"
                        v-model="textChangeInput"
                        :rows="2"
                        type="textarea"
                        style="text-align: center">
                    </el-input>

                    <p v-html="arr[1][0]" v-else></p>
                  </el-col>
                </el-row>
              </div>

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
            <el-button color="#409EFF" @click="andSearchDialogShow=true" plain style="width: 130px;margin: 15px 0 0 0">
              多字搜索
            </el-button>
            <el-button color="#409EFF" @click="outExcel" plain style="width: 130px;margin: 15px 0 0 0">导出表格
            </el-button>
            <el-button color="#409EFF" @click="dictDialogShow=true" plain style="width: 130px;margin: 15px 0 0 0">辞典排序
            </el-button>
            <el-button color="#409EFF" @click="readConfig();settingDialogShow=true;" plain
                       style="width: 130px;margin: 15px 0 0 0">重新设置
            </el-button>
            <el-button color="#409EFF" @click="textOutDialogShow=true" plain
                       style="width: 130px;margin: 15px 0 0 0">文本导出
            </el-button>
            <el-button color="#409EFF" @click="goHead" plain style="width: 130px;margin: 15px 0 0 0">返回顶部
            </el-button>
            <el-tag type="info" plain style="width: 130px;margin: 15px 0 0 0">共：{{ textDict.length }} 字位</el-tag>
          </el-form>
          <el-dialog
              v-model="dictDialogShow"
              title="辞典排序"
              width="30%"
          >
            <div style="padding: 10px 0 10px 0">
              <el-button type="primary" plain round @click="pinyinPositiveOrder">拼音正序</el-button>
            </div>
            <div style="padding: 10px 0 10px 0">
              <el-button type="primary" plain round @click="pinyinReverseOrder">拼音逆序</el-button>
            </div>
            <div style="padding: 10px 0 10px 0">
              <el-button type="primary" plain round @click="numPositiveOrder">数量正序</el-button>
            </div>
            <div style="padding: 10px 0 10px 0">
              <el-button type="primary" plain round @click="numReverseOrder">数量逆序</el-button>
            </div>
            <div style="padding: 10px 0 10px 0">
              <el-button type="primary" plain round @click="recoverOrder">恢复默认</el-button>
            </div>
          </el-dialog>
          <el-dialog
              v-model="textOutDialogShow"
              title="文本导出"
              width="30%"
          >
            <div style="padding: 10px 0 10px 0">
              <el-button type="primary" plain round @click="outDictText">正常导出</el-button>
            </div>
            <div style="padding: 10px 0 10px 0">
              <el-button type="primary" plain round @click="outDictTextSpecial">去除(*)[]导出</el-button>
            </div>
          </el-dialog>

          <el-dialog
              v-model="settingDialogShow"
              title="重新设置"
              width="40%"
          >
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
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="settingDialogShow = false">取消</el-button>
                <el-button type="primary" @click="reSetting"
                >确定</el-button
                >
              </span>
            </template>
          </el-dialog>


          <el-dialog
              v-model="andSearchDialogShow"
              title="多字搜索"
              width="60%"
          >
            <div>
              <!--搜索框和搜索按钮-->
              <el-input
                  v-model="andSearchInput"
                  class="w-50 m-2"
                  placeholder="输入要搜索的字，多字用空格分割，回车搜索"
                  :prefix-icon="Search"
                  @keyup.enter.native="andSearch"
              />
            </div>
            <div v-if="needOpen">
              <div class="line-component dict-line" v-for="(obj,ind) in andSearchResult">
                <el-row :gutter="5">
                  <el-col :span="3" class="book-name">
                    <p style="text-align: center">{{ obj.title }}</p>
                  </el-col>
                  <el-col :span="20" class="line-text">
                    <p v-html="obj.text" :name="obj.text" @click="getTextView"
                       style="color: #3a8ee6;cursor:pointer;"></p>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-else>
              <div class="line-component dict-line" v-for="(obj,ind) in andSearchResult">
                <el-row :gutter="5">
                  <el-col :span="3" class="book-name">
                    <p style="text-align: center">{{ obj.title }}</p>
                  </el-col>
                  <el-col :span="20" class="line-text">
                    <p v-html="obj.text"></p>
                  </el-col>
                </el-row>
              </div>
            </div>


          </el-dialog>
        </div>
      </el-affix>
    </el-col>
  </el-row>
</template>


<script>
import {useProfileStore} from "../../store";

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择

const adapter = new FileSync('./DATAS/config.json'); // 申明一个适配器
const db = low(adapter);
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
      textDictCopy: [],
      dictDialogShow: false,
      settingDialogShow: false,
      textOutDialogShow: false,
      andSearchDialogShow: false,
      andSearchResult: [],
      andSearchInput: "",
      zimuShow: false,
      objLocation: {},
      settingForm: {
        splitInput: '',
        filterInput: '',
        minLength: '',
        removedInput: '',
      },
      textChangeInput: '',
      textChangeList: [],
    }
  },
  methods: {
    searchWord(val) {
      let flag = 0;
      for (let index in this.textDict) {
        if (this.textDict[index].name === val) {
          if (typeof (this.activeNames) === "object") {
            this.activeNames = [parseInt(this.textDict[index].id)];
          } else {
            this.activeNames = parseInt(this.textDict[index].id);
          }
          flag = 1;
          break
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

      if (JSON.stringify(this.objLocation) === '{}') {
        this.textDict.forEach((obj, index) => {
          this.objLocation[obj.id] = index;
          //console.log(this.objLocation)
        })
        //console.log(this.objLocation)
      }

      //手风琴模式和正常模式不一样，一个是string一个是array
      let indexes = [];
      if (typeof (this.activeNames) === "number") {
        indexes.push(this.activeNames)
      } else {
        indexes = this.activeNames;
      }

      indexes.forEach((i) => {
        let keyword = this.textDict[this.objLocation[i]].name;
        keyword = keyword.replace(/\[/g, '').replace(/]/g, '')//修复keyword里点击出现很多的bug
        let lines = this.textDict[this.objLocation[i]].textList;
        // this.textDict.forEach((obj)=>{
        //   debugger
        //   if(obj.id===i){
        //     debugger
        //     keyword = obj.name;
        //     lines = obj.textList;
        //   }
        // })

        //去除样式
        lines.forEach((line, index) => {
          lines[index][1][0] = line[1][0].replace(/<span class="highlight-text">.*?<\/span>/g, keyword)
          //去除 [] ()
          let strList1 = line[1][0].match(/<span class="long-word">.*?<\/span>/g);
          debugger
          if (strList1 !== null) {
            strList1 = [...new Set(strList1)]
            strList1.forEach((str) => {
              let sliceStr = str.slice(24, -7);
              //console.log(sliceStr)
              lines[index][1][0] = line[1][0].replace(str, sliceStr);
            })
          }

          let strList2 = line[1][0].match(/<span class="like-word">.*?<\/span>/g);
          if (strList2 !== null) {
            strList2 = [...new Set(strList2)]
            strList2.forEach((str) => {
              let sliceStr = str.slice(24, -7);
              //console.log(sliceStr)
              lines[index][1][0] = line[1][0].replace(str, sliceStr);
            })
          }

        })
        //文本高亮
        if (this.isHighLight === true) {
          lines.forEach((line, index) => {
            lines[index][1][0] = line[1][0].replace(eval("/" + keyword + "/g"), '<span class="highlight-text">' + keyword + '</span>')
          })
        }
        // 修改() []的格式
        lines.forEach((line, index) => {
          let strList1 = line[1][0].match(/\[.*?]/g);
          if (strList1 !== null) {
            strList1 = [...new Set(strList1)]
            strList1.forEach((str) => {
              line[1][0] = line[1][0].replace(str, '<span class="long-word">' + str + '</span>')
            })

          }
          let strList2 = line[1][0].match(/（.*?）/g);
          if (strList2 !== null) {
            strList2 = [...new Set(strList2)]
            strList2.forEach((str) => {
              line[1][0] = line[1][0].replace(str, '<span class="like-word">' + str + '</span>')
            })

          }
        })
      })
    },
    outExcel() {
      let excelData1 = []
      let excelData2 = [['字词', '出现句数', '出现次数']]
      this.textDict.forEach((obj) => {

        let flag = true;
        excelData2.push([obj.name, obj.textList.length, obj.charCount])
        obj.textList.forEach((lst) => {
          let tempList = []
          let wordName = obj.name.length > 1 ? "[" + obj.name + "]" : obj.name
          if (flag) {
            tempList.push(obj.name)
            tempList.push(lst[2])
            tempList.push(lst[0])
            //去除 [] ()
            let strList1 = lst[1][0].match(/<span class="long-word">.*?<\/span>/g);
            // debugger
            if (strList1 !== null) {
              strList1 = [...new Set(strList1)]
              strList1.forEach((str) => {
                let sliceStr = str.slice(24, -7);
                lst[1][0] = lst[1][0].replace(str, sliceStr);
              })
            }

            let strList2 = lst[1][0].match(/<span class="like-word">.*?<\/span>/g);
            if (strList2 !== null) {
              strList2 = [...new Set(strList2)]
              strList2.forEach((str) => {
                let sliceStr = str.slice(24, -7);
                lst[1][0] = lst[1][0].replace(str, sliceStr);
              })
            }
            tempList.push(lst[1][0].replace(/<span class="highlight-text">.*?<\/span>/g, wordName))
            excelData1.push(tempList)
            flag = false
          } else {
            tempList.push('')
            tempList.push(lst[2])
            tempList.push(lst[0])
            tempList.push(lst[1][0].replace(/<span class="highlight-text">.*?<\/span>/g, wordName))
            excelData1.push(tempList)
          }
          // line.replace(.*?<\/span>/g, keyword)
          // line = line.replace(/<span class="highlight-text">/g, '')
          // line = line.replace(/<\/span>/g, '')
          // tempList.push(line)
        })

      })
      debugger
      let res = [excelData1, excelData2]
      ipc.send('saveDictExcel', JSON.stringify(res))
    },
    getTextView(evt) {
      let keyLine = evt.target.innerText;
      localStorage.setItem("keyLine", keyLine);
      ipc.send('openDictViewText')
    },
    pinyinPositiveOrder() {
      if (this.textDictCopy.length === 0) {
        this.textDictCopy = JSON.parse(JSON.stringify(this.textDict))
      }

      this.textDict.sort((a, b) => {
        //特殊符号!97-122
        let x = []
        x.push(a.initial[0] === undefined ? 1000 : a.initial[0].charCodeAt());
        x.push(a.initial[1] === undefined ? 1000 : a.initial[1].charCodeAt());
        let y = []
        y.push(b.initial[0] === undefined ? 1000 : b.initial[0].charCodeAt());
        y.push(b.initial[1] === undefined ? 1000 : b.initial[1].charCodeAt());
        if (x[0] < 97 || x[0] > 122) {
          x[0] = 1000;
        }
        if (y[0] < 97 || y[0] > 122) {
          y[0] = 1000;
        }
        if (x[0] === y[0]) {
          return x[1] - y[1];
        } else {
          return x[0] - y[0];
        }

      })
      this.objLocation = {}
      this.textDict.forEach((obj, index) => {
        this.objLocation[obj.id] = index;
      })
      this.zimuShow = true;
      this.dictDialogShow = false;
    },
    pinyinReverseOrder() {
      if (this.textDictCopy.length === 0) {
        this.textDictCopy = JSON.parse(JSON.stringify(this.textDict))
      }
      this.textDict.sort((a, b) => {
        //特殊符号65-90 97-122
        let x = []
        x.push(a.initial[0] === undefined ? 1000 : a.initial[0].charCodeAt());
        x.push(a.initial[1] === undefined ? 1000 : a.initial[1].charCodeAt());
        let y = []
        y.push(b.initial[0] === undefined ? 1000 : b.initial[0].charCodeAt());
        y.push(b.initial[1] === undefined ? 1000 : b.initial[1].charCodeAt());
        if (x[0] < 97 || x[0] > 122) {
          x[0] = 1000;
        }
        if (y[0] < 97 || y[0] > 122) {
          y[0] = 1000;
        }
        if (x[0] === y[0]) {
          return y[1] - x[1];
        } else {
          // if(y[1]===1000)
          //   return true;
          return y[0] - x[0];
        }

      })
      this.objLocation = {}
      this.textDict.forEach((obj, index) => {
        this.objLocation[obj.id] = index;
      })
      this.zimuShow = true;
      this.dictDialogShow = false;
    },
    numPositiveOrder() {
      if (this.textDictCopy.length === 0) {
        this.textDictCopy = JSON.parse(JSON.stringify(this.textDict))
      }
      this.textDict.sort((a, b) => {
        return a.textList.length - b.textList.length;
      })
      this.objLocation = {}
      this.textDict.forEach((obj, index) => {
        this.objLocation[obj.id] = index;
      })
      this.zimuShow = false;
      this.dictDialogShow = false;
    },
    numReverseOrder() {
      if (this.textDictCopy.length === 0) {
        this.textDictCopy = JSON.parse(JSON.stringify(this.textDict))
      }
      this.textDict.sort((a, b) => {
        return b.textList.length - a.textList.length;
      })
      this.objLocation = {}
      this.textDict.forEach((obj, index) => {
        this.objLocation[obj.id] = index;
      })
      this.zimuShow = false;
      this.dictDialogShow = false;
    },
    recoverOrder() {
      this.textDict.sort((a, b) => {
        return a.id - b.id;
      })
      this.objLocation = {}
      this.textDict.forEach((obj, index) => {
        this.objLocation[obj.id] = index;
      })
      this.zimuShow = false;
      this.dictDialogShow = false;
    },
    readConfig() {
      try {
        //console.dir(db.__wrapped__.textDict)
        let filter = db.__wrapped__.textDict.filter
        let textSplit = db.__wrapped__.textDict.textSplit
        let minLength = db.__wrapped__.textDict.minLength
        let removed = db.__wrapped__.textDict.removed
        debugger
        if (filter !== "undefined" && filter.length > 0) {
          this.settingForm.filterInput = filter;
        }
        if (textSplit !== "undefined" && textSplit.length > 0) {
          this.settingForm.splitInput = textSplit;
        }
        if (removed !== "undefined" && removed.length > 0) {
          this.settingForm.removedInput = removed;
        }
        if (minLength !== "undefined") {
          this.settingForm.minLength = minLength;
        }
      } catch (e) {
        console.log(e)
      }
    },
    reSetting() {
      db.set('textDict.filter', this.settingForm.filterInput).write()
      db.set('textDict.textSplit', this.settingForm.splitInput).write()
      db.set('textDict.minLength', this.settingForm.minLength).write()
      db.set('textDict.removed', this.settingForm.removedInput).write()
      this.$emit("reSetting", JSON.stringify(this.settingForm))
      this.settingDialogShow = false

    },
    dblclick(isClicked, arr, keyword) {
      if (isClicked) {
        arr[1][0] = arr[1][0].replace(/<span class="highlight-text">.*?<\/span>/g, keyword)
        //去除 [] ()
        let strList1 = arr[1][0].match(/<span class="long-word">.*?<\/span>/g);
        debugger
        if (strList1 !== null) {
          strList1 = [...new Set(strList1)]
          strList1.forEach((str) => {
            let sliceStr = str.slice(24, -7);
            arr[1][0] = arr[1][0].replace(str, sliceStr);
          })
        }
        debugger
        let strList2 = arr[1][0].match(/<span class="like-word">.*?<\/span>/g);
        if (strList2 !== null) {
          strList2 = [...new Set(strList2)]
          strList2.forEach((str) => {
            let sliceStr = str.slice(24, -7);
            // console.log(sliceStr)
            arr[1][0] = arr[1][0].replace(str, sliceStr);
          })
        }


        this.textChangeInput = arr[1][0];
      } else {
        if (this.textChangeInput !== arr[1][0]) {
          let flag = true
          for (let i = 0; i < this.textChangeList.length; i++) {
            if (this.textChangeList[i][1] === arr[1][0]) {
              debugger
              let dictText = localStorage.getItem("dictText")
              dictText = dictText.replace(eval("/" + this.textChangeList[i][1].replace(/\[/g, "\\[") + "/g"), this.textChangeInput)
              localStorage.setItem("dictText", dictText)
              this.textChangeList[i][1] = this.textChangeInput
              debugger
              arr[1][0] = this.textChangeInput.replace(eval("/" + keyword + "/g"), '<span class="highlight-text">' + keyword + '</span>')
              // 修改() []的格式
              let strList1 = arr[1][0].match(/\[.*?]/g);
              if (strList1 !== null) {
                strList1 = [...new Set(strList1)]
                strList1.forEach((str) => {
                  arr[1][0] = arr[1][0].replace(str, '<span class="long-word">' + str + '</span>')
                })
              }

              let strList2 = arr[1][0].match(/（.*?）/g);
              if (strList2 !== null) {
                strList2 = [...new Set(strList2)]
                strList2.forEach((str) => {
                  arr[1][0] = arr[1][0].replace(str, '<span class="like-word">' + str + '</span>')
                })
              }
              flag = false
            }
          }
          if (flag) {
            this.textChangeList.push([arr[1][0], this.textChangeInput])
            debugger
            let dictText = localStorage.getItem("dictText")
            //console.log(eval("/" + arr[1][0].replace(/\[/g, "\\[") + "/g"))
            dictText = dictText.replace(eval("/" + arr[1][0].replace(/\[/g, "\\[") + "/g"), this.textChangeInput)
            localStorage.setItem("dictText", dictText)
            debugger
            arr[1][0] = this.textChangeInput.replace(eval("/" + keyword + "/g"), '<span class="highlight-text">' + keyword + '</span>')
            // 修改() []的格式
            let strList1 = arr[1][0].match(/\[.*?]/g);
            if (strList1 !== null) {
              strList1 = [...new Set(strList1)]
              strList1.forEach((str) => {
                arr[1][0] = arr[1][0].replace(str, '<span class="long-word">' + str + '</span>')
              })
            }

            let strList2 = arr[1][0].match(/（.*?）/g);
            if (strList2 !== null) {
              strList2 = [...new Set(strList2)]
              strList2.forEach((str) => {
                arr[1][0] = arr[1][0].replace(str, '<span class="like-word">' + str + '</span>')
              })
            }
          }
        } else {
          arr[1][0] = this.textChangeInput.replace(eval("/" + keyword + "/g"), '<span class="highlight-text">' + keyword + '</span>')
          // 修改() []的格式
          let strList1 = arr[1][0].match(/\[.*?]/g);
          if (strList1 !== null) {
            strList1 = [...new Set(strList1)]
            strList1.forEach((str) => {
              arr[1][0] = arr[1][0].replace(str, '<span class="long-word">' + str + '</span>')
            })
          }

          let strList2 = arr[1][0].match(/（.*?）/g);
          if (strList2 !== null) {
            strList2 = [...new Set(strList2)]
            strList2.forEach((str) => {
              arr[1][0] = arr[1][0].replace(str, '<span class="like-word">' + str + '</span>')
            })
          }
        }
      }
    }
    ,
    //[]中的字替换
    specialWordReplace() {

    }
    ,
    outDictText() {
      // const profileStore = useProfileStore() // 获取到store的实例
      // let text=profileStore.dictText[0].text
      // this.textChangeList.forEach((arr)=>{
      //   text=text.replace(eval("/"+arr[0]+"/g"),arr[1])
      // })
      ipc.send('saveDictText', localStorage.getItem("dictText"))
      this.textOutDialogShow = false
    },
    outDictTextSpecial() {
      let text = localStorage.getItem("dictText")
      text = text.replace(/\[/g, "").replace(/]/g, "").replace(/（.*?）/g, "")
      debugger
      ipc.send('saveDictText', text)
      this.textOutDialogShow = false
    },
    andSearch() {
      // 分割关键词
      let keywordList = this.andSearchInput.split(" ")
      // 搜索
      const that = this
      this.textDict.forEach((line) => {
        let flag = true
        line.textList.forEach((text) => {
          keywordList.forEach((keyword) => {
            if (text[1][0].indexOf(keyword) === -1) {
              flag = false
            }
          })
          if (flag) {
            that.andSearchResult.push({
              title: text[2],
              text: text[1][0]
            })
          }
        })

      })
      // 对象去重
      this.andSearchResult = [...new Map(this.andSearchResult.map(item => [item.title+item.text, item])).values()]
    },

  },
  mounted() {


  },
  watch: {
    keyword(newName, oldName) {
      if (newName.length >= 1) {
        this.searchWord(newName);
      }
    },
  }

}
</script>

<style scoped>
.dict-collapse {
  margin-left: 20px;
}

.dict-line {
  font-size: 16px;
  font-family: 'Adobe 楷体 Std R';
  border: solid #8c939d;
  border-radius: 10px;
  margin: 5px 0 5px 0;
}

.book-name {
  border-right: solid #8c939d;
}

.line-num {
  border-right: solid #8c939d;
  text-align: center;
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

>>> .long-word {
  color: #ff00ff;
}

>>> .like-word {
  color: #00AD77;
}
</style>

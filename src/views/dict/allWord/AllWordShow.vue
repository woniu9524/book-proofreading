<template>
<!--  <el-tabs v-model="activeName" class="dict-tabs">
    <el-tab-pane label="折叠面板" name="collapse">

    </el-tab-pane>
    <el-tab-pane label="力导向图" name="graph">
      <dict-g6 :settingForm="settingForm"/>
    </el-tab-pane>
  </el-tabs>-->
  <dict-collapse
      :text-dict.sync="textDict"
      @reSetting="reSetting"
      v-if="fresh"

  />
</template>

<script>
import {useProfileStore} from '../../../store'
import {makeInvertedIndex,kMeansForSentences} from '../../../js/dict/dictUtil.js'

import DictCollapse from "../../../components/dict/DictCollapse.vue";
import DictG6 from "../../../components/dict/DictG6.vue";
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择
const adapter = new FileSync('./DATAS/config.json'); // 申明一个适配器
const db = low(adapter);
export default {
  name: "AllWordShow",
  components: {
    DictCollapse,
    DictG6,
  },
  data() {
    return {
      settingForm: {
        splitInput: '',
        filterInput: '',
        minLength: 0,
        removedInput: '',
      },
      textDict: [],
      activeName: "collapse",
      fresh:true,
    }
  },
  methods: {
    reSetting(settingForm){
      this.settingForm=JSON.parse(settingForm)
      const profileStore = useProfileStore() // 获取到store的实例
      debugger
      this.textDict = makeInvertedIndex(this.settingForm.removedInput, this.settingForm.splitInput, this.settingForm.filterInput, this.settingForm.minLength, profileStore.dictText[0].text);

      this.fresh = false
      this.$nextTick(() => {
        this.fresh = true
      })
    },

  },
  mounted() {
    const profileStore = useProfileStore() // 获取到store的实例
    this.settingForm = JSON.parse(this.$route.query.settingForm);
    this.textDict = makeInvertedIndex(this.settingForm.removedInput, this.settingForm.splitInput, this.settingForm.filterInput, this.settingForm.minLength, localStorage.getItem("dictText"));


  }
}

</script>

<style scoped>
.dict-tabs {
  margin-left: 10px;
}
</style>

<template>
<!--  <el-tabs v-model="activeName" class="dict-tabs">
    <el-tab-pane label="折叠面板" name="collapse">

    </el-tab-pane>
    <el-tab-pane label="力导向图" name="graph">
      <dict-g6 :settingForm="settingForm"/>
    </el-tab-pane>
  </el-tabs>-->
  <dict-collapse
      :text-dict="textDict"
  />
</template>

<script>
import {useProfileStore} from '../../../store'
import {makeKeywordDict} from '../../../js/dict/dictUtil.js'

import DictCollapse from "../../../components/dict/DictCollapse.vue";
import DictG6 from "../../../components/dict/DictG6.vue";
export default {
  name: "keyWordShow.vue",
  components: {
    DictCollapse,
    DictG6,
  },
  data(){
    return{
      textDict: [],
      activeName: "collapse",
      settingForm:{
        splitInput:"，。；？",
        keywordSplitInput:"",
        minLength:0,
      }
    }
  },
  mounted() {
    this.settingForm = JSON.parse(this.$route.query.settingForm);
    let text=this.$route.query.text;
    let keyword=this.$route.query.keyword;
    this.textDict=makeKeywordDict(this.settingForm,text,keyword);
  }
}
</script>

<style scoped>

</style>

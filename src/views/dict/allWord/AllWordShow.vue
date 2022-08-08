<template>
  <el-tabs v-model="activeName" class="dict-tabs">
    <el-tab-pane label="折叠面板" name="collapse">
      <dict-collapse
          :text-dict="textDict"
      />
    </el-tab-pane>
    <el-tab-pane label="力导向图" name="graph">
      <dict-g6 :settingForm="settingForm"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {useProfileStore} from '../../../store'
import {makeInvertedIndex} from '../../../js/dict/dictUtil.js'

import DictCollapse from "../../../components/dict/DictCollapse.vue";
import DictG6 from "../../../components/dict/DictG6.vue";
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
    }
  },
  methods: {},
  mounted() {
    const profileStore = useProfileStore() // 获取到store的实例
    this.settingForm = JSON.parse(this.$route.query.settingForm);
    this.textDict = makeInvertedIndex(this.settingForm.removedInput, this.settingForm.splitInput, this.settingForm.filterInput, this.settingForm.minLength, profileStore.dictText[0].text);


  }
}

</script>

<style scoped>
.dict-tabs {
  margin-left: 10px;
}
</style>

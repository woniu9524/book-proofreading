<template>
  <el-row>
    <!--侧边栏-->
    <el-col :span="3">
      <el-affix>
        <el-menu
            default-active="3"
            class="el-menu-vertical"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <star/>
              </el-icon>
              <span>小工具</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="toBooksSearch">书本搜索</el-menu-item>
              <el-menu-item index="1-2" @click="toBooksCompare">书本比对</el-menu-item>
              <el-menu-item index="1-3" @click="toJian">繁体简体转换</el-menu-item>
              <el-menu-item index="1-4" @click="toYi">繁体异体转换</el-menu-item>
              <el-menu-item index="1-5" @click="toMakeBook">章节封装成书</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon>
                <collection/>
              </el-icon>
              <span>文本辞典</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="toAllWord">全文辞典</el-menu-item>
              <el-menu-item index="2-2" @click="toKeyword">关键词辞典</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-menu-item index="3" @click="toCompare">
            <el-icon>
              <search/>
            </el-icon>
            <template #title>校对工具</template>
          </el-menu-item>
          <el-menu-item index="4" @click="toRead">
            <el-icon>
              <notebook/>
            </el-icon>
            <template #title>文本阅读</template>
          </el-menu-item>
          <el-menu-item index="5" @click="toSetting">
            <el-icon>
              <setting/>
            </el-icon>
            <template #title>全局配置</template>
          </el-menu-item>
          <el-menu-item index="6" @click="toTable">
            <el-icon>
              <list/>
            </el-icon>
            <template #title>表格设置</template>
          </el-menu-item>
          <el-menu-item index="7" @click="openIntroduce">
            <el-icon>
              <opportunity/>
            </el-icon>
            <template #title>使用说明</template>
          </el-menu-item>
        </el-menu>
      </el-affix>
    </el-col>

    <!--主页部分-->
    <el-col :span="21">
      <router-view></router-view>
    </el-col>
  </el-row>

</template>

<script setup>
import {
  Notebook,
  Star,
  Search,
  Menu as IconMenu,
  Setting,
  List,
  Opportunity,
  Collection
} from '@element-plus/icons-vue'

</script>

<script>
export default {
  methods: {
    toJian() {
      this.$router.push('/tools/jian')
    },
    toYi() {
      this.$router.push('/tools/yi')
    },
    toCompare() {
      this.$router.push('/compare/index')
    },
    toSetting() {
      this.$router.push('/setting')
    },
    toAllWord() {
      this.$router.push("/dict/allWordSetting")
    },
    toKeyword() {
      this.$router.push("/dict/keyWordSetting")
    },
    toBooksCompare() {
      this.$router.push('/tools/compare')
    },
    toBooksSearch() {
      this.$router.push('/tools/search')
    },
    toTable() {
      this.$router.push('/setting/table')
    },
    toRead() {
      this.$router.push('/book/index')
    },
    toMakeBook() {
      this.$router.push('/tools/make')
    },
    openIntroduce() {
      const {shell} = require('electron');
      const uri = "https://www.yuque.com/woniu-avesf/tvyxhx/sg007f"
      shell.openExternal(uri);
    }
  }
}
</script>


<style scoped>
.el-menu-vertical:not(.el-menu--collapse) {
  min-height: 620px;
}

.el-menu-item {
  min-width: 120px;
}
</style>

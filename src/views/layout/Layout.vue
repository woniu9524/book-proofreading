<template>
    <el-row >
        <!--侧边栏-->
        <el-col :span="3">
            <el-menu
                    default-active="2"
                    class="el-menu-vertical"
            >
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon><star /></el-icon>
                        <span>小工具</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="1-1" @click="toSearch">书本搜索</el-menu-item>
                        <el-menu-item index="1-2" @click="toBookCompare">书本比对</el-menu-item>
                        <el-menu-item index="1-3" @click="toJian">繁体简体转换</el-menu-item>
                        <el-menu-item index="1-4" @click="toYi">繁体异体转换</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-menu-item index="2" @click="toCompare">
                    <el-icon><search /></el-icon>
                    <template #title>校对工具</template>
                </el-menu-item>
                <el-menu-item index="3">
                    <el-icon><notebook /></el-icon>
                    <template #title>文本阅读</template>
                </el-menu-item>
                <el-menu-item index="4" @click="toSetting">
                    <el-icon><setting /></el-icon>
                    <template #title>全局配置</template>
                </el-menu-item>
            </el-menu>
        </el-col>

        <!--主页部分-->
        <el-col :span="21">
            <router-view></router-view>
        </el-col>
    </el-row>

</template>

<script  setup>
    import {
        Notebook,
        Star,
        Search,
        Menu as IconMenu,
        Setting,
    } from '@element-plus/icons-vue'

</script>

<script>
    export default {
        methods:{
            toJian(){
                this.$router.push('/tools/jian')
            },
            toYi(){
                this.$router.push('/tools/yi')
            },
            toCompare(){
                this.$router.push('/compare/index')
            },
            toSetting(){
                this.$router.push('/setting')
            }
        }
    }
</script>







<style scoped>
    .el-menu-vertical:not(.el-menu--collapse) {
        min-height: 620px;
    }
    .el-menu-item{
        min-width: 120px;
    }
</style>
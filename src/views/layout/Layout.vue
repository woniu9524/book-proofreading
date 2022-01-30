<template>
    <div id="Side">
        <el-row >
            <el-col :span="3">
                <el-menu
                        default-active="1"
                        class="el-menu-vertical"
                        @open="handleOpen"
                >
                    <el-sub-menu index="1">
                        <template #title >
                            <span>小工具</span>
                        </template>
                        <el-menu-item-group title="Group One">
                            <el-menu-item index="1-1">item one</el-menu-item>
                            <el-menu-item index="1-2">item one</el-menu-item>
                        </el-menu-item-group>

                    </el-sub-menu>
                    <el-menu-item index="2">
                        <span>古籍校对</span>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <span>古籍阅读</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <span>其他</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="21">
                <router-view></router-view>
            </el-col>
        </el-row>
    </div>

</template>

<script>
    export default {
        name: "Layout",
        methods:{
            handleOpen(index){
                console.log(index)
            }
        }
    }
</script>

<style scoped>
    .el-menu-vertical:not(.el-menu--collapse) {
        min-height: 620px;
    }

</style>
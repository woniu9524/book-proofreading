<template>
    <el-tabs type="border-card" class="tab-setting">
        <el-tab-pane label="繁体/简体表">
            <DBTable
                :table-data="tableData"
                :args="{'key':'简体','value':'繁体'}"
            ></DBTable>
        </el-tab-pane>
        <el-tab-pane label="异体/繁体表">
            <DBTable
                    :table-data="tableData"
                    :args="{'key':'异体','value':'繁体'}"
            ></DBTable>
        </el-tab-pane>
        <el-tab-pane label="自定义的表">
            <DBTable
                    :table-data="tableData"
                    :args="{'key':'自定义1','value':'自定义2'}"
            ></DBTable>
        </el-tab-pane>
        <el-tab-pane label="停用词表">

        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import DBTable from '../../components/setting/table/index.vue'
    export default {
        name: "TableSetting",
        components:{
            DBTable,
        },
        data(){
            return{
                tableData:[],
            }
        }
    }
</script>

<style scoped>
    .tab-setting{
      height: 100%;
    }


</style>

<template>
    <el-tabs v-model="activeName" type="border-card" class="tab-setting">
        <el-tab-pane name="simple" label="繁体/简体表" >
            <DBTable
                :table-data="tableData"
                :args="{'key':'简体','value':'繁体'}"
                :table-prop="{'arg1':'jian','arg2':'fan'}"
                @updateTable="tableData=$event"
            ></DBTable>
        </el-tab-pane>
        <el-tab-pane name="diff" label="异体/繁体表" >
            <DBTable
                    :table-data="tableData"
                    :args="{'key':'异体','value':'繁体'}"
                    :table-prop="{'arg1':'yi','arg2':'fan'}"
            ></DBTable>
        </el-tab-pane>
        <el-tab-pane name="custom" label="自定义的表">
            <DBTable
                    :table-data="tableData"
                    :args="{'key':'自定义1','value':'自定义2'}"
                    :table-prop="{'arg1':'A','arg2':'B'}"
            ></DBTable>
        </el-tab-pane>
        <el-tab-pane name="stop" label="停用词表">
            <Stop></Stop>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import DBTable from '../../components/setting/table/index.vue'
    import {deleteWord, readDB} from "../../js/setting/table";
    import Stop from '../../components/setting/stop/index.vue'
    export default {
        name: "TableSetting",
        components:{
            DBTable,
            Stop
        },
        data(){
            return{
                tableData:[],
                activeName:'simple',
            }
        },
        methods:{

        },
        mounted(){
            this.tableData= readDB(this.activeName)
        },
        watch:{
            activeName(newVal){
                this.tableData= readDB(newVal)
            }
        }
    }
</script>

<style scoped>
    .tab-setting{
      height: 100%;
    }


</style>

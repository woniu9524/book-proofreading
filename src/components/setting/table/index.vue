<template>
    <div class="search-box">
        <el-input
                v-model="keyword"
                class="w-50 m-2 search-input"
                size="large"
                placeholder="输入查找内容"
        ></el-input>
        <span style="margin: 0 2px"></span>
        <el-button class="search-btn" type="primary" size="large" @click="search">搜索</el-button>
        <el-button size="large" class="add-btn" @click="addDialog=true">添加</el-button>
        <!--设置对话框-->
        <el-dialog v-model="addDialog" title="添加" class="setting-dialog" width="200px">
            <el-form ref="addForm">
                <el-form-item :label="args.key">
                    <el-input v-model="addForm.arg1" placeholder="Please input"/>
                </el-form-item>
                <el-form-item :label="args.value">
                    <el-input v-model="addForm.arg2" placeholder="Please input"/>
                </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="addDialog = false">取消</el-button>
                <el-button type="primary" @click="addOne"
                >添加</el-button
                >
              </span>
            </template>
        </el-dialog>
    </div>
    <div style="width: 600px;margin: auto">
        <el-table :data="tableData" border style="width: 100%;height: 480px">
            <el-table-column prop="arg1" :label="args.key"/>
            <el-table-column prop="arg2" :label="args.value"/>
            <el-table-column prop="do" label="操作">
                <template #default="scope">
                    <el-button
                            type="text"
                            size="small"
                            @click.prevent="deleteRow(scope.$index)"
                    >
                        Remove
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {defineComponent} from "@vue/runtime-core";

    export default defineComponent({
        name: "index",
        props: {
            tableData: {
                type: Object,
                default: [],
            },
            args: {
                type: Object,
                default: {
                    key: "key",
                    value: "value",
                }
            }

        },
        data() {
            return {
                keyword: '',
                addDialog: false,
                addForm: {
                    arg1: '',
                    arg2: '',
                    type: '',
                },
            }
        },
        methods:{
            addOne(){

            },
            search(){

            },
            deleteRow(){
                this.tableData.value.splice(index, 1)
                //TODO 在数据库中删除
            }
        }
    })
</script>

<style scoped>
    .search-box {
        margin: 10px auto 10px auto;
        text-align: center;
    }
    .search-input {
        display: inline-block;
        width: 400px;
    }
    .add-btn{
        display: inline-block;
        border: 1px solid dodgerblue;
    }

    .search-btn {
        display: inline-block;
        border: 1px solid dodgerblue;
        border-radius: 0px 25px 25px 0px;
    }
    >>> input.el-input__inner {
        border: 1px solid dodgerblue;
        border-radius: 25px 0 0 25px;
    }
</style>

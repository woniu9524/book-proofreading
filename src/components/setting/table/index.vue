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
        <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border
                  style="width: 100%;max-height: 480px">
            <el-table-column :prop="tableProp.arg1" :label="args.key"/>
            <el-table-column :prop="tableProp.arg2" :label="args.value"/>
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
        <!--分页-->
        <div class="split-page">
            <el-pagination
                    v-model:currentPage="currentPage"
                    :page-size="pageSize"
                    layout="total, prev, pager, next"
                    :total="tableData.length"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {defineComponent} from "@vue/runtime-core";
    import {deleteWord, writeWord} from "../../../js/setting/table";
    import {ElMessage} from "element-plus";

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
            },
            tableProp: {
                type: Object,
                default: {},
            }

        },
        data() {
            return {
                keyword: '',
                addDialog: false,
                addForm: {
                    arg1: '',
                    arg2: '',
                },
                currentPage: 1,
                pageSize: 10,
                tableCopy:[],
            }
        },
        methods: {
            addOne() {
                let word1 = this.addForm.arg1
                let word2 = this.addForm.arg2
                let arg1 = this.tableProp.arg1
                let arg2 = this.tableProp.arg2
                let table = 'custom'
                if (arg1 === 'jian') {
                    table = 'simple'
                } else if (arg1 === 'yi') {
                    table = 'diff'
                }
                let temp={}
                temp[arg1] = word1
                temp[arg2] = word2
                writeWord(table, temp)
                //this.tableData.push(temp)
                ElMessage({
                    type: 'success',
                    message: "添加完成~",
                })
                this.addDialog=false

            },
            search() {
                // debugger
                if(this.keyword===''){
                    if(this.tableData.length<this.tableCopy.length){
                        this.$emit('updateTable',this.tableCopy)
                    }
                }else {
                    this.tableCopy=JSON.parse(JSON.stringify(this.tableData))
                    for (let i=0;i<this.tableData.length;i++){
                        if(this.tableData[i][this.tableProp.arg1]===this.keyword||this.tableData[i][this.tableProp.arg2]===this.keyword){
                            this.$emit('updateTable',[this.tableData[i]])
                            break
                        }
                    }
                }

            },
            deleteRow(index) {
                let arg1 = this.tableProp.arg1
                let word = this.tableData[index][arg1]
                let table = 'custom'
                if (arg1 === 'jian') {
                    table = 'simple'
                } else if (arg1 === 'yi') {
                    table = 'diff'
                }
                this.tableData.splice(index, 1)
                deleteWord(table, arg1, word)
                ElMessage({
                    type: 'success',
                    message: "删除完成~",
                })

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

    .add-btn {
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

    .split-page {
        text-align: center;
        margin: auto;
        width: 450px;
    }
</style>

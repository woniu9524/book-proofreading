<template>
    <el-container>
        <el-header class="first-header">
            <el-menu
                    class="first-menu"
                    mode="horizontal"
            >
                <el-menu-item index="1" @click="goBack">返回</el-menu-item>
                <el-sub-menu index="4">
                    <template #title>排序</template>
                    <el-menu-item index="4-1" @click="orderRank">按相似度正序</el-menu-item>
                    <el-menu-item index="4-2" @click="reverseRank">按相似度逆序</el-menu-item>
                    <el-menu-item index="4-3" @click="normalRank">按文件名顺序</el-menu-item>
                </el-sub-menu>
                <el-menu-item index="5" @click="settingHighlight=true">高亮设置</el-menu-item>
                <el-menu-item index="6" @click="writeOut">导出</el-menu-item>
            </el-menu>
        </el-header>
        <el-main style="padding: 20px 10px">
            <div class="similar-table">
                <el-table
                        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                        height="510"
                        style="width: 100%">
                    <el-table-column prop="firstNo" label="序号" width="80"/>
                    <el-table-column prop="firstText" label="底稿内容">
                        <template #default="scope">
                            <span v-html="scope.row.firstText"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="secondNo" label="序号" width="80"/>
                    <el-table-column prop="secondText" label="用来校对内容">
                        <template #default="scope">
                            <span v-html="scope.row.secondText"></span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="similar"
                            label="相似度"
                            width="100"
                    >
                        <template #default="scope">
                            <el-tag
                                    :type="scope.row.similar < filterThreshold ? 'danger' : ''"
                                    disable-transitions
                            >{{ scope.row.similar }}
                            </el-tag
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>
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
        </el-main>
    </el-container>
    <!--高亮设置对话框-->
    <el-dialog v-model="settingHighlight" title="高亮设置" class="setting-dialog" width="400px">
        <el-form ref="rankSetting">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="忽略标点符号">
                        <el-switch v-model="highlightSetting.ignoreSign"></el-switch>
                    </el-form-item>
                    <el-form-item label="忽略简体繁体">
                        <el-switch v-model="highlightSetting.ignoreFanTi"></el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="忽略繁体异体">
                        <el-switch v-model="highlightSetting.ignoreYiTi"></el-switch>
                    </el-form-item>
                    <el-form-item label="忽略自定义表">
                        <el-switch v-model="highlightSetting.ignoreCustom"></el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
              <span class="dialog-footer">
                <el-button @click="settingHighlight = false">取消</el-button>
                <el-button type="primary" @click="resetHighlight">确认重置</el-button
                >
      </span>
        </template>
    </el-dialog>
</template>

<script>
    import {highlightHandler} from '../../js/compare/highlightText'
    import {useProfileStore} from "../../store";
    import {storeToRefs} from 'pinia'
    const ipc = require('electron').ipcRenderer
    ipc.on('saveEnd',()=>{
        alert("导出完成！")
    })
    export default {
        name: "TableView",
        data() {
            return {
                filterThreshold: 0.5,
                highlightSetting: {
                    ignoreCustom: false,
                    ignoreFanTi: false,
                    ignoreYiTi: false,
                    ignoreSign: true,
                },
                tableData: [],
                currentPage: 1,
                pageSize: 50,
                settingHighlight: false,
                resList: [],//纯文字的table
                flag: '',

            }
        },
        methods: {
            resetHighlight() {
                this.resList = JSON.parse(JSON.stringify(this.resList))
                this.tableData = []
                this.resList.forEach((obj, i) => {
                    let ignore = {
                        'ignoreSign': this.highlightSetting.ignoreSign,
                        'ignoreFanTi': this.highlightSetting.ignoreFanTi,
                        'ignoreYiTi': this.highlightSetting.ignoreYiTi,
                        'ignoreCustom': this.highlightSetting.ignoreCustom
                    }
                    let res = highlightHandler(obj.origin, obj.compare, ignore)
                    this.tableData.push({
                        'firstNo': obj.originFileName,
                        'firstText': res.h1,
                        'secondNo': obj.compareFileName,
                        'secondText': res.h2,
                        'similar': obj.cos,
                        'no': i
                    })
                })

                this.orderRank()

                this.settingHighlight = false
            },
            //正序排序
            orderRank() {
                this.tableData.sort(((a, b) => {
                    return b.similar - a.similar;
                }))

            },
            //逆序排序
            reverseRank() {
                this.tableData.sort(((a, b) => {
                    return a.similar - b.similar;
                }))
            },
            //恢复正常排序（底稿顺序）
            normalRank() {
                this.tableData.sort(((a, b) => {
                    return a.no - b.no;
                }))
            },
            goBack() {
                if (this.flag === 'search') {
                    this.$router.push({path: '/tools/search', query: {'books': this.$route.query.books}})
                } else {
                    this.$router.push('/tools/compare')
                }
            },
            writeOut() {
                let data = []
                this.resList.forEach((line) => {
                    data.push([line.originFileName, line.origin, line.compareFileName, line.compare, line.cos])
                })
                debugger
                ipc.send('saveExcel', JSON.stringify(data))

            },

        },
        mounted() {
            //全局配置
            const profileStore = useProfileStore() // 获取到store的实例
            const {highlight} = storeToRefs(profileStore)
            this.highlightSetting = highlight.value
            //重置表格
            this.resList = JSON.parse(this.$route.query.table)

            this.flag = this.$route.query.flag
            this.resetHighlight()


        }
    }
</script>

<style scoped>
    .first-header {
        padding: 0;
    }

    .similar-table {
        margin-top: 10px;
        padding: 0;
    }

    .el-main {
        padding: 0 0 !important;
    }

    .split-page {
        text-align: center;
        margin: auto;
        width: 300px;
    }

    >>> .text-diff {
        background-color: #fbff00;
        display: inline-block;
        color: #f00;
        padding-left: 3px;
        padding-right: 3px;
        border-radius: 5px;
        border: 1px solid #ef6063;
    }

    >>> .text-added {
        background-color: #60C25E;
        display: inline-block;
        color: #2F4858;
        padding-left: 3px;
        padding-right: 3px;
        border-radius: 5px;
        border: 1px solid #00AD77;
    }

    >>> .text-removed {
        background-color: #845EC2;
        display: inline-block;
        color: #F9F871;
        padding-left: 3px;
        padding-right: 3px;
        border-radius: 5px;
        border: 1px solid #D65DB1;


    }
</style>

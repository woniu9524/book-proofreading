<template>
    <el-container>
        <el-header class="first-header">
            <el-menu
                    class="first-menu"
                    mode="horizontal"
                    @select="handleSelect"
            >
                <el-menu-item index="1" @click="go_index">上一步</el-menu-item>
                <el-menu-item index="2" @click="open_introduction">说明</el-menu-item>
                <el-menu-item index="3" @click="setting=true">参数设置</el-menu-item>
                <el-sub-menu index="4">
                    <template #title>排序</template>
                    <el-menu-item index="4-1" @click="orderRank">按相似度正序</el-menu-item>
                    <el-menu-item index="4-2" @click="reverseRank">按相似度逆序</el-menu-item>
                    <el-menu-item index="4-3" @click="normalRank">恢复正常顺序</el-menu-item>
                </el-sub-menu>
                <el-menu-item index="5" @click="go_next">下一步</el-menu-item>
            </el-menu>
        </el-header>
        <el-main style="padding: 20px 10px">
            <div class="similar-table">
                <el-table
                        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                        height="510"
                        style="width: 100%"
                        @row-dblclick="dbclick">
                    <el-table-column prop="firstNo" label="序号" width="80" />
                    <el-table-column prop="firstText" label="底稿内容">
                        <template #default="scope">
                            <el-input
                                    v-if="scope.row.isClicked"
                                    v-model="scope.row.firstText"
                                    type="textarea"
                                    placeholder="Please input"
                            />
                            <span v-else v-html="scope.row.firstText"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="secondNo" label="序号" width="80"/>
                    <el-table-column prop="secondText" label="用来校对内容">
                        <template #default="scope">
                            <el-input
                                    v-if="scope.row.isClicked"
                                    v-model="scope.row.secondText"
                                    type="textarea"
                                    placeholder="Please input"
                            />
                            <span v-else v-html="scope.row.secondText"></span>
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
                            >{{ scope.row.similar }}</el-tag
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
    <!--说明抽屉-->
    <el-drawer v-model="introduceDrawer" title="说明">
        <div>
            <p><span style="color: red">&emsp;双击</span>某一行可以编辑用来校对的文本，<span style="color: deepskyblue">再次双击</span>保存修改</p>
        </div>
        <!--TODO 说明没写完-->
    </el-drawer>
    <!--参数设置对话框-->
    <el-dialog v-model="setting" title="参数设置" class="setting-dialog" width="400px">
        <el-form ref="rankSetting">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="阈值一">
                        <el-input v-model="rankSetting.highThreshold"></el-input>
                    </el-form-item>
                    <el-form-item label="阈值二">
                        <el-input v-model="rankSetting.filterThreshold"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="阈值三">
                        <el-input v-model="rankSetting.lowThreshold"></el-input>
                    </el-form-item>
                    <el-form-item label="窗口值">
                        <el-input v-model="rankSetting.win"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="忽略标点符号">
                        <el-switch v-model="rankSetting.ignoreSign"></el-switch>
                    </el-form-item>
                    <el-form-item label="忽略简体繁体">
                        <el-switch v-model="rankSetting.ignoreFanTi"></el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="忽略繁体异体">
                        <el-switch v-model="rankSetting.ignoreYiTi"></el-switch>
                    </el-form-item>
                    <el-form-item label="忽略自定义表">
                        <el-switch v-model="rankSetting.ignoreCustom"></el-switch>
                    </el-form-item>
                </el-col>
            </el-row>

            <p style="color: red">各项参数应如何调整，可在说明中查看！</p>
        </el-form>
        <template #footer>
              <span class="dialog-footer">
                <el-button @click="setting = false">取消</el-button>
                <el-button type="primary" @click="resetTable">确认重置</el-button
                >
      </span>
        </template>
    </el-dialog>
</template>

<script>
    import {computeCosSimilar} from '../../js/compare/computeSimilar'
    import {getTextList} from '../../js/compare/splitArticles.js'
    import {rankSentence} from '../../js/compare/rankText.js'
    import {useProfileStore} from "../../store";
    import {storeToRefs} from 'pinia'
    export default {
        name: "CompareFirst",
        data(){
            return{
                rankSetting:{
                    filterThreshold:0.5,
                    lowThreshold:0.3,
                    highThreshold:0.9,
                    win:100,
                    ignoreFanTi:false,
                    ignoreYiTi:false,
                    ignoreSign:true,
                },
                splitSign:'',
                introduceDrawer:false,

                tableData:[],
                currentPage:1,
                pageSize:50,
                setting:false,

                ignoreCustom_rank:false,
                resList:[],
            }
        },
        methods:{
            resetTable(){
                const profileStore = useProfileStore() // 获取到store的实例
                const {articles,splitSign}=storeToRefs(profileStore)
                let textLists= getTextList(articles.value[0].text,articles.value[1].text,splitSign.value)//得到分割后的文本
                this.resList=rankSentence(textLists[0],textLists[1],100,0.9,0.7,0.3,this.ignoreSign,this.ignoreYiTi,this.ignoreFanTi)
                this.tableData=[]
                this.resList.forEach((arr)=>{
                    this.tableData.push({
                        'firstNo':arr[0][0]+'-'+arr[0][1],
                        'firstText':arr[0][2],
                        'secondNo':arr[1][0]+'-'+arr[0][1],
                        'secondText':arr[1][2],
                        'similar':arr[2],
                        'isClicked':false,
                    })
                })
                this.setting=false
            },
            //正序排序
            orderRank(){
                this.tableData.sort(((a, b) => {
                    return b.similar-a.similar;
                }))

            },
            //逆序排序
            reverseRank(){
                this.tableData.sort(((a, b) => {
                    return a.similar-b.similar;
                }))
            },
            //恢复正常排序（底稿顺序）
            normalRank(){
                this.tableData.sort(((a, b) => {
                    let aa=a.firstNo.split('-');
                    let bb=b.firstNo.split('-');
                    return aa[0]-bb[0];
                }))
            },
            //双击事件
            dbclick(row){
                row.isClicked=!row.isClicked;
                if(row.isClicked===false){
                    let cos=computeCosSimilar(row.firstText,row.secondText,this.ignoreSign,this.ignoreFanTi,this.ignoreYiTi);
                    row.similar=cos;
                    //更新resList余弦值
                    let location=row.firstNo.split('-')[1]-1//位置是firstNo的-后面的数字-1
                    this.resList[location][0][2]=row.firstText
                    this.resList[location][1][2]=row.secondText
                    this.resList[location][2]=cos
                    /*for(let i=0;i<this.resList.length;i++){
                        if(this.resList[i][0][0]+'-'+this.resList[i][0][1]===row.firstNo){
                            this.resList[i][0][2]=row.firstText
                            this.resList[i][1][2]=row.secondText
                            this.resList[i][2]=cos
                            break;
                        }
                    }*/
                }


            },

        },
        mounted() {
            const profileStore = useProfileStore() // 获取到store的实例
            const {rank,highlight}=storeToRefs(profileStore)
            this.rankSetting=rank.value//设置为全局配置中的
            console.log(rank.value)
            this.resetTable()

        }
    }
</script>

<style scoped>
    .first-header{
        padding: 0;
    }
    .similar-table{
        margin-top: 10px;
        padding: 0;
    }
    .el-main{
        padding: 0 0 !important;
    }
    .split-page{
        text-align: center;
    }
</style>
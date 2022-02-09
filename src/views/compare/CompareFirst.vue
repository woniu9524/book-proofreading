<template>
    <el-container>
        <el-header class="first-header">
            <el-menu
                    class="first-menu"
                    mode="horizontal"
            >
                <el-menu-item index="1" @click="goIndex">上一步</el-menu-item>
                <el-menu-item index="2" @click="openIntroduction">说明</el-menu-item>
                <el-menu-item index="3" @click="settingRank=true">排序设置</el-menu-item>
                <el-sub-menu index="4">
                    <template #title>排序</template>
                    <el-menu-item index="4-1" @click="orderRank">按相似度正序</el-menu-item>
                    <el-menu-item index="4-2" @click="reverseRank">按相似度逆序</el-menu-item>
                    <el-menu-item index="4-3" @click="normalRank">恢复正常顺序</el-menu-item>
                </el-sub-menu>
                <el-menu-item index="5" @click="settingHighlight=true">高亮设置</el-menu-item>
                <el-menu-item index="6" @click="goNext">下一步</el-menu-item>
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
                                    :type="scope.row.similar < rankSetting.filterThreshold ? 'danger' : ''"
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
    <!--排序设置对话框-->
    <el-dialog v-model="settingRank" title="排序设置" class="setting-dialog" width="400px">
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
                <el-button @click="settingRank = false">取消</el-button>
                <el-button type="primary" @click="resetTable">确认重置</el-button
                >
      </span>
        </template>
    </el-dialog>
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

            <p style="color: red">各项参数应如何调整，可在说明中查看！</p>
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
                    ignoreCustom:false,
                },
                highlightSetting:{
                    ignoreCustom:false,
                    ignoreFanTi:false,
                    ignoreYiTi:false,
                    ignoreSign:true,
                },
                splitSign:'',
                introduceDrawer:false,

                tableData:[],
                currentPage:1,
                pageSize:50,
                settingRank:false,
                settingHighlight:false,
                resList:[],//纯文字的table
                highlightList:[],//高连文本的table

            }
        },
        methods:{
            resetTable(){
                const profileStore = useProfileStore() // 获取到store的实例
                const {articles,splitSign}=storeToRefs(profileStore)
                let textLists= getTextList(articles.value[0].text,articles.value[1].text,splitSign.value)//得到分割后的文本
                this.resList=rankSentence(textLists[0],textLists[1],100,0.9,0.7,0.3,this.rankSetting.ignoreSign,this.rankSetting.ignoreYiTi,this.rankSetting.ignoreFanTi)
                this.resList=JSON.parse(JSON.stringify(this.resList))//这里做一下深拷贝，不然在双击更新的时候会同步更新通序号的那个数组里面的内容
                this.tableData=[]
                this.resList.forEach((arr)=>{
                    /*this.tableData.push({
                        'firstNo':arr[0][0]+'-'+arr[0][1],
                        'firstText':arr[0][2],
                        'secondNo':arr[1][0]+'-'+arr[0][1],
                        'secondText':arr[1][2],
                        'similar':arr[2],
                        'isClicked':false,
                    })*/
                    let ignore={'ignoreSign':this.highlightSetting.ignoreSign,'ignoreFanTi':this.highlightSetting.ignoreFanTi,'ignoreYiTi':this.highlightSetting.ignoreYiTi,'ignoreCustom':false}
                    let res= highlightHandler(arr[0][2],arr[1][2],ignore)
                    this.tableData.push({
                        'firstNo':arr[0][0]+'-'+arr[0][1],
                        'firstText':res.h1,
                        'secondNo':arr[1][0]+'-'+arr[1][1],
                        'secondText':res.h2,
                        'similar':arr[2],
                        'isClicked':false,
                    })
                })
                this.settingRank=false
            },
            resetHighlight(){
                this.tableData=[]
                this.resList.forEach((arr)=>{
                    /*this.tableData.push({
                        'firstNo':arr[0][0]+'-'+arr[0][1],
                        'firstText':arr[0][2],
                        'secondNo':arr[1][0]+'-'+arr[0][1],
                        'secondText':arr[1][2],
                        'similar':arr[2],
                        'isClicked':false,
                    })*/
                    let ignore={'ignoreSign':this.highlightSetting.ignoreSign,'ignoreFanTi':this.highlightSetting.ignoreFanTi,'ignoreYiTi':this.highlightSetting.ignoreYiTi,'ignoreCustom':false}
                    let res= highlightHandler(arr[0][2],arr[1][2],ignore)
                    // debugger
                    this.tableData.push({
                        'firstNo':arr[0][0]+'-'+arr[0][1],
                        'firstText':res.h1,
                        'secondNo':arr[1][0]+'-'+arr[1][1],
                        'secondText':res.h2,
                        'similar':arr[2],
                        'isClicked':false,
                    })
                })
                this.settingHighlight=false
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
                    // console.log(aa,bb)
                    return aa[1]-bb[1];
                }))
            },
            //双击事件
            dbclick(row){
                // debugger
                if(row.isClicked===false){
                    // debugger
                    //当双击要修改时，将两段文本换成原文本
                    let location=row.firstNo.split('-')[1]-1//位置是firstNo的-后面的数字-1
                    row.firstText=this.resList[location][0][2]
                    row.secondText=this.resList[location][1][2]
                }
                row.isClicked=!row.isClicked;
                if(row.isClicked===false){
                    // debugger
                    //当双击恢复时，先更新resList
                    let cos=computeCosSimilar(row.firstText,row.secondText,this.rankSetting.ignoreSign,this.rankSetting.ignoreFanTi,this.rankSetting.ignoreYiTi);
                    row.similar=cos;
                    //更新resList余弦值和新的文本
                    let location=row.firstNo.split('-')[1]-1//位置是firstNo的-后面的数字-1
                    this.resList[location][0][2]=row.firstText
                    this.resList[location][1][2]=row.secondText
                    this.resList[location][2]=cos
                    //文本高亮
                    let res= highlightHandler(row.firstText,row.secondText,this.highlightSetting.ignoreSign,this.highlightSetting.ignoreFanTi,this.highlightSetting.ignoreYiTi)
                    row.firstText=res.h1
                    row.secondText=res.h2
                }
            },
            goIndex(){
                this.$router.push('/compare/index')
            },
            goNext(){
                this.$router.push('/compare/second')
            },
            openIntroduction(){
                this.introduceDrawer=true
            },

        },
        mounted() {
            //全局配置
            const profileStore = useProfileStore() // 获取到store的实例
            const {rank,highlight}=storeToRefs(profileStore)
            this.rankSetting=rank.value//设置为全局配置中的
            this.highlightSetting=highlight.value
            //重置表格
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

    >>> .text-diff{
        background-color: #fbff00;
        display: inline-block;
        color: #f00;
        padding-left: 3px;
        padding-right: 3px;
        border-radius: 5px;
        border: 1px solid #ef6063;
    }
    >>> .text-added{
        background-color: #60C25E;
        display: inline-block;
        color: #2F4858;
        padding-left: 3px;
        padding-right: 3px;
        border-radius: 5px;
        border: 1px solid #00AD77;
    }
    >>> .text-removed{
        background-color: #845EC2;
        display: inline-block;
        color: #F9F871;
        padding-left: 3px;
        padding-right: 3px;
        border-radius: 5px;
        border: 1px solid #D65DB1;


    }
</style>
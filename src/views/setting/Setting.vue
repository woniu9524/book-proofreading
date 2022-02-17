<template>
    <el-card class="box-card" shadow="never">
        <template #header>
            <div class="card-header">
                <span>排序配置</span>
            </div>
        </template>
        <div>
            <el-form ref="rank">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="阈值一">
                            <el-input v-model="rank.highThreshold"></el-input>
                        </el-form-item>
                        <el-form-item label="阈值二">
                            <el-input v-model="rank.filterThreshold"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="阈值三">
                            <el-input v-model="rank.lowThreshold"></el-input>
                        </el-form-item>
                        <el-form-item label="窗口值">
                            <el-input v-model="rank.win"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="分割符号">
                            <el-input v-model="rank.splitSign"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="忽略标点符号">
                            <el-switch v-model="rank.ignoreSign"></el-switch>
                        </el-form-item>
                        <el-form-item label="忽略简体繁体">
                            <el-switch v-model="rank.ignoreFanTi"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="忽略繁体异体">
                            <el-switch v-model="rank.ignoreYiTi"></el-switch>
                        </el-form-item>
                        <el-form-item label="忽略自定义表">
                            <el-switch v-model="rank.ignoreCustom"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </el-card>

    <el-card class="box-card" shadow="never">
        <template #header>
            <div class="card-header">
                <span>高亮配置</span>
            </div>
        </template>
        <div>
            <el-form ref="highlight">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="忽略标点符号">
                            <el-switch v-model="highlight.ignoreSign"></el-switch>
                        </el-form-item>
                        <el-form-item label="忽略简体繁体">
                            <el-switch v-model="highlight.ignoreFanTi"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="忽略繁体异体">
                            <el-switch v-model="highlight.ignoreYiTi"></el-switch>
                        </el-form-item>
                        <el-form-item label="忽略自定义表">
                            <el-switch v-model="highlight.ignoreCustom"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </el-card>
</template>

<script>
    import {useProfileStore} from "../../store";

    const low = require('lowdb');
    const FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择

    const adapter = new FileSync('./DATAS/config.json'); // 申明一个适配器
    const db = low(adapter);

    export default {
        name: "Setting",
        data(){
            return{
                rank:{
                    highThreshold:0.9,
                    filterThreshold:0.7,
                    lowThreshold:0.3,
                    win:100,
                    ignoreFanTi:false,
                    ignoreYiTi:false,
                    ignoreCustom:false,
                    ignoreSign:true,
                    splitSign:'。？！',
                },
                highlight:{
                    ignoreFanTi:false,
                    ignoreYiTi:false,
                    ignoreCustom:false,
                    ignoreSign:true,
                }
            }
        },
        methods:{
            readConfig(){
                let res={}
                res['splitSign']=db.get('rank').find('splitSign').value()//分割的标点
                res['rank']=db.get('rank').value()
                res['highlight']=db.get('highlight').value()

                this.rank=res['rank']
                this.splitSign=res['splitSign']
                this.highlight=res['highlight']
            },

        },
        mounted() {
          this.readConfig()
        },
        watch:{
            rank:{
                handler(val){
                    db.get().find().assign().write();//大半夜的见鬼了，离谱，为什么可以运行，卧槽
                    db.set('rank.ignoreFanTi',val.ignoreFanTi).write()
                    const profileStore = useProfileStore() // 获取到store的实例
                    profileStore.updateConfig()//更新全局变量
                },
                deep:true
            },
            highlight:{
                handler(val){
                    db.set('highlight.ignoreFanTi',val.ignoreFanTi).write()
                    db.set('highlight.ignoreYiTi',val.ignoreYiTi).write()
                    db.set('highlight.ignoreCustom',val.ignoreCustom).write()
                    db.set('highlight.ignoreSign',val.ignoreSign).write()
                    const profileStore = useProfileStore() // 获取到store的实例
                    profileStore.updateConfig()//更新全局变量
                },
                deep:true
            }
        }

    }
</script>

<style scoped>
    .box-card{
        width: 95%;
        margin: 15px auto;
    }
    .el-input{
        width: 100px;
    }

</style>

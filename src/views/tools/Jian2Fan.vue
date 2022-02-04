<template>
    <div id="jian">
        <div class="text-area">
            <el-input
                    v-model="textarea"
                    :rows="18"
                    type="textarea"
                    placeholder="输入要转换的文本"
            />
        </div>
        <div class="options">
            <el-button type="primary" round @click="JianToFan">简体转繁体</el-button>
            <el-button type="success" round @click="FanToJian">繁体转简体</el-button>
            <el-button type="warning" round @click="textarea=''">清空</el-button>
        </div>
    </div>
</template>

<script>
    const low = require('lowdb');
    const FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择
    const adapter = new FileSync('./DATAS/db.json'); // 申明一个适配器
    const db = low(adapter);

    export default {
        name: "Jian2Fan",
        data(){
            return{
                textarea:'',
            }
        },
        methods:{

            JianToFan(){
                let newtext='';
                for(let char of this.textarea){
                    let res=db.get('simple').find({'jian':char}).value()
                    if (typeof (res)!="undefined"){
                        newtext+=res.fan;
                    }else{
                        newtext+=char
                    }
                }
                this.textarea=newtext;

            },

            FanToJian(){
                let newtext='';
                for(let char of this.textarea){
                    let res=db.get('simple').find({'fan':char}).value()
                    if (typeof (res)!="undefined"){
                        newtext+=res.jian;
                    }else{
                        newtext+=char
                    }
                }
                this.textarea=newtext;
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>
    .text-area{
        width: 700px;
        margin: 50px auto 20px auto;
    }
    .options{
        text-align: center;
    }
</style>
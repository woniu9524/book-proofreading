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
            <el-button type="success" round @click="YiToFan">异体转繁体</el-button>
            <el-button type="primary" round @click="FanToYi">繁体转异体</el-button>
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
        name: "Yi2Fan",
        data(){
            return{
                textarea:'',
            }
        },
        methods:{
            YiToFan(){
                let newtext='';
                for(let char of this.textarea){
                    let res=db.get('diff').find({'yi':char}).value()
                    if (typeof (res)!="undefined"){
                        newtext+=res.fan;
                    }else{
                        newtext+=char
                    }
                }
                this.textarea=newtext;

            },

            FanToYi(){
                let newtext='';
                for(let char of this.textarea){
                    let res=db.get('diff').find({'fan':char}).value()
                    if (typeof (res)!="undefined"){
                        newtext+=res.yi;
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
<template>
    <div class="stop-word">
        <el-input
                v-model="textarea"
                :autosize="{ minRows: 10, maxRows: 10 }"
                type="textarea"
                placeholder="Please input"
        />
    </div>
    <div class="btn-style">
        <el-button type="success" plain @click="saveStop" size="large">保 存</el-button>
    </div>
</template>

<script>
    import {defineComponent} from "@vue/runtime-core";
    import {readDB, writeStop} from "../../../js/setting/table";
    import {ElMessage} from "element-plus";


    export default defineComponent({
        name: "index",
        props:{

        },
        data(){
            return{
                textarea:"",
            }
        },
        methods:{
            readStop(){
                let res=readDB('stop')
                res.forEach((char)=>{
                    this.textarea+=char+' '
                })
            },
            saveStop(){
                let charList=[]
                for (let char of this.textarea){
                    if(char!==''){
                        charList.push(char)
                    }
                }
                charList= Array.from(new Set(charList))
                writeStop(charList)
                ElMessage({
                    type: 'success',
                    message: "保存完成~",
                })
            }
        },
        mounted() {
            this.readStop()
        }

    })
</script>

<style scoped>
    .stop-word{
        width: 500px;
        margin: 50px auto 20px auto;
    }
    .btn-style{
        margin: auto;
        text-align: center;
    }
</style>

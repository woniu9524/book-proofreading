<template>
    <div class="previewBackground ">
        <el-card class="textCard" shadow="always">
            <p v-html="html" @click="getDiff"></p>
        </el-card>
    </div>
</template>

<script>
    import { ElNotification } from 'element-plus'
    export default {
        name: "PreviewHtml",
        data(){
          return{
              previewData:'',
              html:'',
              diffTable:[],
          }
        },
        methods:{
            splitData(){
                let temp=this.previewData.split('\n||||||||||||||||||||||||||\n')
                if(temp.length!==2){
                    alert("出现错误")
                }else {
                    this.html=temp[0]
                    this.diffTable=JSON.parse(temp[1])
                }
            },
            getDiff(){
                if(event.target.className==='text-diff'){
                    let num = event.target.name;
                    console.log(num)
                    for (let obj of this.diffTable){
                        if (obj.name===num){
                            ElNotification({
                                title: '校对',
                                dangerouslyUseHTMLString: true,
                                message: '<p class="notice" ">'+obj.origin+" 校对版本为 "+obj.compare+'</p>',
                                type: 'success',
                            })
                        }
                    }
                }
            },

        },
        mounted() {
            this.previewData=localStorage.getItem('previewData')
            this.splitData()
        }
    }
</script>

<style scoped>
    >>> .text-diff{
        color: #ef6063;
        text-decoration: none;
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
    >>>.notice{
        color: #845EC2;
    }
    >>>.para-style{
        font-family: 方正楷体S-超大字符集;
        font-size: 20px;
    }
    .textCard {
        padding: 0px 64px;
        width: 70%;
        margin: 50px auto 0 auto;
    }
    .previewBackground {
        background-color: #ede8d5;
        background-size: 100% 100%;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        overflow-y: auto;

    }

</style>
<template>
    <el-row :gutter="20" style="margin:0px 20px 0px 20px">
        <el-col :span="12">
            <el-scrollbar height="720px">
                <p v-html="fileText1"></p>
            </el-scrollbar>
        </el-col>
        <el-col :span="12">
            <el-scrollbar height="720px">
                <p v-html="fileText2"></p>
            </el-scrollbar>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "FindText",
        data(){
            return{
                fileText1:'',
                fileText2:'',
            }
        },
        methods:{
            toHtml(text,keyword,name){
                let html=''
                text.split('\n').forEach((text)=>{
                    html+='<p>'+text+'</p>'
                })
                html=html.replace(keyword,'<span id="'+name+'" class="highlight-text">'+keyword+'</span>')
                return html
            },
            searchText(keyword) {
                debugger
                if (window.find && window.getSelection) {
                    document.designMode = "on";
                    let sel = window.getSelection();
                    sel.collapse(document.body, 0);

                    while (window.find(keyword)) {
                        document.execCommand("HiliteColor", false, "yellow");
                    }
                    sel.collapseToStart();
                    document.designMode = "off";
                }
            }

        },
        mounted(){

            let text1=localStorage.getItem('text1')
            let text2=localStorage.getItem('text2')
            this.fileText1=this.toHtml(localStorage.getItem('fileText1'),text1,'key1')
            this.fileText2=this.toHtml(localStorage.getItem('fileText2'),text2,'key2')
            this.$nextTick(() => {
                document.getElementById('key1').scrollIntoView({block:"center",inline:"center"})
                document.getElementById('key2').scrollIntoView({block:"center",inline:"center"})
            });



        }
    }
</script>

<style scoped>
    >>>.highlight-text{
        background-color: #845EC2;
        display: inline-block;
        color: #F9F871;
        padding-left: 3px;
        padding-right: 3px;
        border-radius: 5px;
        border: 1px solid #D65DB1;
        text-decoration:none;
    }
</style>

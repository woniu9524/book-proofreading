<template>
  <div class="previewBackground ">
    <el-card class="textCard" shadow="always">
      <p v-html="fileText"></p>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "DictTextView",
  data(){
    return{
      dictText:'',
      keyLine:"",
      fileText:'',
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
    debugger
    this.dictText=localStorage.getItem('dictText')
    this.keyLine=localStorage.getItem("keyLine")
    this.fileText=this.toHtml(this.dictText,this.keyLine,'key1')
    this.$nextTick(() => {
      document.getElementById('key1').scrollIntoView({block:"center",inline:"center"})
    });

  }
}
</script>

<style scoped>

.textCard {
  padding: 0px 64px;
  width: 70%;
  margin: 50px auto 0 auto;
  background-color:#FAF7ED;
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

>>> .highlight-text {
  background-color: #fbff00;
  display: inline-block;
  color: #f00;
  padding-left: 3px;
  padding-right: 3px;
  border-radius: 5px;
  border: 1px solid #ef6063;
}

</style>

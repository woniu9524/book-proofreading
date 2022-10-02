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
      debugger
      console.log(eval("/" + keyword.replace(/\[/g,'\\[')+"/g"))
      let reg=new RegExp(eval("/" + keyword.replace(/\[/g,'\\[')+"/g"))
      console.log(reg.test(text))
      html=html.replace(eval("/" + keyword.replace(/\[/g,'\\[')+"/g"),'<span id="'+name+'" class="highlight-text">'+keyword.replace(/\\\//g,'\/')+'</span>')

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

    // 修改() []的格式
    let strList1 = this.dictText.match(/\[.*?]/g);
    debugger
    if (strList1 !== null) {
      strList1=[...new Set(strList1)]
      strList1.forEach((str) => {
        this.dictText = this.dictText.replace(str, '<span class="long-word">' + str + '</span>')

      })
    }
    debugger

    let strList2 = this.dictText.match(/（.*?）/g);
    if (strList2 !== null) {
      strList2=[...new Set(strList2)]
      strList2.forEach((str) => {
        this.dictText = this.dictText.replace(str, '<span class="like-word">' + str + '</span>')
      })
    }
    // this.dictText=this.dictText.replace(/\[/g,'')
    // this.dictText=this.dictText.replace(/]/g,'')
    this.keyLine=localStorage.getItem("keyLine")
    // 修改() []的格式
    strList1 = this.keyLine.match(/\[.*?]/g);
    debugger
    if (strList1 !== null) {
      strList1=[...new Set(strList1)]
      strList1.forEach((str) => {
        this.keyLine = this.keyLine.replace(str, '<span class="long-word">' + str + '<\\/span>')
      })
    }

    strList2 = this.keyLine.match(/（.*?）/g);
    if (strList2 !== null) {
      strList2=[...new Set(strList2)]
      strList2.forEach((str) => {
        this.keyLine = this.keyLine.replace(str, '<span class="like-word">' + str + '<\\/span>')
      })
    }
    console.log(this.keyLine)
    this.fileText=this.toHtml(this.dictText,this.keyLine,'key1')
    this.$nextTick(() => {
      document.getElementById('key1').scrollIntoView({block:"center",inline:"center"})
    });
    const that=this;


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

>>> .long-word {
  color: #ff00ff;
}

>>> .like-word {
  color: #00AD77;
}
</style>

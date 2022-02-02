/*
* 分割文章
* */

//分割段落
export const splitBySign=(textList,splitSign)=>{
    let sentence=[]
    let paragraphCount=1//段落计数（这里从1开始计数！！！）
    let sentenceCount=1//句子计数（也是从一开始）
    textList.forEach((text)=>{
        let temp=[];
        let start=0;
        let flag1=0;//有的结尾没有指定的符号
        for(let i=1;i<text.length;i++){
            if (splitSign.indexOf(text[i]) > -1) {
                temp.push(text.slice(start,i+1));//取值左闭右开
                start=i+1;
                flag1=1;
            }
        }
        if(flag1===0){
            temp.push(text);//结尾没有符号的情况
        }
        temp.forEach((text)=>{
            sentence.push([paragraphCount,sentenceCount,text])
            sentenceCount++
        })
        paragraphCount++

    })
    return sentence
}

//获取段落列表(除去空的段落)
export const getTextList=(book1,book2,splitSign)=>{
    //获取除去空段落的段落
    let bookList1 = book1.split('\n').filter((text) => {
        return text.trim() !== '';
    })
    let bookList2 = book2.split('\n').filter((text) => {
        return text.trim() !== '';
    })
    //分割成句子
    let sentence1=splitBySign(bookList1,splitSign)//返回的sentence的格式是[第i段,第i句,内容]，且i从一开始计数
    let sentence2=splitBySign(bookList2,splitSign)
    return [sentence1,sentence2]
}


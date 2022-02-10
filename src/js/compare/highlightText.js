import {getDiffObjs, mergeSame} from './diffText'
export const addHighLightByAttribute=(obj)=>{
    if(obj.type==='diff'){
        // debugger
        // removed added 的情况,也就是有差异部分
        return '<span class="text-diff" name="'+obj.name+'">'+obj.value+'</span>';
    }else if(obj.type==='added'){
        return '<span class="text-added">'+obj.value+'</span>';
    }else if(obj.type==='removed'){
        return '<span class="text-removed">'+obj.value+'</span>';
    }else {
        return obj.value;
    }
}


const addHighlight=(commonTextList)=>{
    //添加高亮
    let highlightText=''
    commonTextList.forEach((obj)=>{
        highlightText+=addHighLightByAttribute(obj)
    })
    return highlightText
}

//处理文本高亮
export const highlightHandler=(text1,text2,ignore)=>{
    let originChars=getDiffObjs(text1,text2,ignore)
    //添加高亮
    let highlightText1= addHighlight(mergeSame(originChars.originChars1))
    let highlightText2= addHighlight(mergeSame(originChars.originChars2))
    return {"h1":highlightText1,"h2":highlightText2}
}


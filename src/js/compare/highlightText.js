import {getDiffObjs} from './diffText'
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
export const addHighlight=(charObjs)=>{
    let locationList=[]//记录改变的位置
    let flag=''
    charObjs.forEach((charObj,i)=>{
        if(charObj.diff===true){
            if(flag!=='diff'){
                locationList.push(i)
                flag='diff'
            }
        }else if(charObj.added===true){
            if (flag!=='added'){
                locationList.push(i)
                flag='added'
            }
        }else if(charObj.removed===true){
            if(flag!=='removed'){
                locationList.push(i)
                flag='removed'
            }
        }else {
            if(flag!=='common'){
                locationList.push(i)
                flag='common'
            }
        }
    })
    //合并相同属性文本
    let commonTextList=[]
    locationList.forEach((location,i,arr)=>{
        //添加类型
        let temp={'value':''}
        if(charObjs[location].diff===true){
            temp.type='diff'
            temp.name=charObjs[location].name
        }else if(charObjs[location].added===true){
            temp.type='added'
        }else if(charObjs[location].removed===true){
            temp.type='removed'
        }else {
            temp.type='common'
        }
        //添加内容
        if(typeof (arr[i+1])==="undefined"){
            charObjs.slice(arr[i],).forEach((obj)=>{
                temp.value+=obj.value
            })
        }else {
            charObjs.slice(arr[i],arr[i+1]).forEach((obj)=>{
                temp.value+=obj.value
            })
        }
        commonTextList.push(temp)
    })
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
    let highlightText1= addHighlight(originChars.originChars1)
    let highlightText2= addHighlight(originChars.originChars2)
    return {"h1":highlightText1,"h2":highlightText2}
}


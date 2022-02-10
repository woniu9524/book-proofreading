/*
* 合并文本生成html页面
* */
import {getDiffObjs, mergeSame} from './diffText'

/*
* 处理符号归属问题
* !#$%&()*+,-./:;<=>?@[]^_`{|}~“”？，！•【】『』〖〗〔〕〈〉〔〕「」（）、。：；’‘……￥·●○§《》  　/t/r
* 归属右边有 [{(【〔〈「（《●○§’“
*其余归属左边
* */

const getSignOrder=(lst)=>{
    // debugger
    lst.forEach((charObj,i,arr)=>{
        if (arr[i].sign){
            if('[{(【〔〈「（《●○§’“'.indexOf(arr[i].value)>-1){
                //归属右边
                let j=1
                while (arr[i+j].sign){
                    j++//防止下一个也是标点
                }
                if(typeof (arr[i+j])!=="undefined"){
                    arr[i].order=arr[i+j].order
                }else {
                    //向右找不到的情况
                    let j=1
                    while (arr[i-j].sign){
                        j++//防止下一个也是标点
                    }
                    if(i-j>0){
                        arr[i].order=arr[i-j].order
                    }else {
                        arr[i].order=0
                    }
                }
            }else {
                //归属左边
                let j=1
                while (typeof (arr[i-j])!=="undefined"&& arr[i-j].sign){
                    j++//防止下一个也是标点
                }
                if(i-j>0){
                    arr[i].order=arr[i-j].order
                }else{
                    //向左找不到的情况
                    let j=1
                    while (arr[i+j].sign){
                        j++//防止下一个也是标点
                    }
                    if(typeof (arr[i+j])!=="undefined") {
                        arr[i].order = arr[i + j].order
                    }else {
                        arr[i].order=0
                    }
                }
            }
        }
    })
    return lst
}

//提取出diff内容
const extractDiff=(chars1,chars2)=>{
    let diffList=[]
    let diffs1=[]
    let diffs2=[]
    let name1=''
    let name2=''
    let temp={}
    chars1.forEach((obj)=>{
        if(typeof (obj.name)!=="undefined"){
            if(obj.name!==name1){
                diffs1.push(temp)
                temp={}
                temp['name']=obj.name
                temp['value']=obj.value
                name1 = obj.name
            }else {
                temp['value']+=obj.value
            }
        }
    })
    diffs1.push(temp)
    temp={}
    chars2.forEach((obj)=>{
        if(typeof (obj.name)!=="undefined"){
            if(obj.name!==name2){
                diffs2.push(temp)
                temp={}
                temp['name']=obj.name
                temp['value']=obj.value
                name2 = obj.name
            }else {
                temp['value']+=obj.value
            }
        }
    })
    diffs2.push(temp)
    diffs1.forEach((obj1)=>{
        for (let obj2 of diffs2){
            if(typeof (obj1.name)!=="undefined"&& obj1.name===obj2.name){
                diffList.push({
                    'name':obj1.name,
                    'origin':obj1.value,
                    'compare':obj2.value
                })
            }
        }
    })

    return diffList
}

export const mergeTexts=(text1,text2,ignore,mergeType)=>{
    let originChars=getDiffObjs(text1,text2,ignore)
    let orderChars1=getSignOrder(originChars.originChars1)
    let orderChars2=getSignOrder(originChars.originChars2)
    console.log(mergeSame(orderChars1),mergeSame(orderChars2))
    let diffList=extractDiff(orderChars1,orderChars2)
    // console.log(diffList)
}



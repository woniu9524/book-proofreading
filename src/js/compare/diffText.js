const Diff = require('diff');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择
const adapter = new FileSync('./DATAS/db.json'); // 申明一个适配器
const db = low(adapter);
import {charCustom,charYiToFan,charFanToJian} from './translate'
/*
*   对文本做高亮处理
*   每个字有四个属性：added removed diff【优先级高于 added removed】 ignored【优先级最高】 name order
*   能够 忽略三个表还有忽略标点符号
*
* 0.【去除标点(可选)步骤一】用一个数组记录所有标点的位置和值(这里是一个标点对象，有value和ignored两个属性)，接着去除文本中的标点
*   【替换表(可选)】替换表，保存位置和对应文字
* 1.用diff库比较文本，找出【removed added】这种相邻的字段，给其添加diff属性，加上name属性，order属性，并将removed和added设置为undefined。
* 2.再将字段对象分成字对象，添加上原有属性，查表加上ignored属性，接着根据removed在左边，added再右边把文本分成两份
* 3.【去除标点(可选)步骤二】遍历符号数组，插入文本列表中，插入位置splice(符号位置,0,符号对象)
* 4.计算其余弦相似度
* 5.高亮标签：把diff removed added连在一起的合并在一个标签里
* 6.根据order，恢复比较形态，底稿有符号，比较的那个不要符号
* */

//忽略表
export const ignoreTable=(text,ignore)=>{
    //记录原来的文字列表
    let textArr=[]
    for (let char of text){
        textArr.push(char)
    }
    //自定义转换
    if(ignore.ignoreCustom){
        let newText=''
        for (let char of text){
            newText+=charCustom(char)
        }
        text=newText
    }
    //异体转繁体
    if(ignore.ignoreYiTi){
        let newText=''
        for (let char of text){
            newText+=charYiToFan(char)
        }
        text=newText
    }
    //繁体转简体
    if(ignore.ignoreFanTi){
        let newText=''
        for (let char of text){
            newText+=charFanToJian(char)
        }
        text=newText
    }
    //返回原文列表和转换后的文本
    return {'originTextArr':textArr,'newText':text}
}

//忽略符号第一步
export const clearSignStepOne=(text)=>{
    const signs='!#$%&()*+,-./:;<=>?@[]^_`{|}~“”？，！•【】『』〖〗〔〕〈〉〔〕「」（）、。：；’‘……￥·●○§《》  　\t\r︰';
    let res=[]
    let count=0
    let str=''
    //记录符号位置和值
    for(let char of text){
        if (signs.indexOf(char)>-1){
            res.push({'location':count, 'value':char})
        }else {
            str+=char
        }
        count++
    }
    return [res,str]//返回标点对象和文本
}

//用diff库比较文本，找出【removed added】这种相邻的字段，给其添加diff属性，加上name属性，并将removed和added设置为undefined。每个字段都加上order.
export const getDiffText=(text1,text2)=>{
    //比较文本
    // console.log(text1,text2)
    let diffList=Diff.diffChars(text1,text2)

    let text1List=[];
    let text2List=[];
    //添加order属性
    diffList.forEach((chars,i,arr)=>{
        arr[i].order=i
    })
    //找出【removed added】这种相邻的字段
    for (let i=1;i<diffList.length+1;i++){
        //给其添加diff属性，加上name属性.
        if(i<diffList.length&&i>0&&diffList[i-1].removed===true&&diffList[i].added===true){
            diffList[i-1].diff=true
            diffList[i].diff=true
            let flag=Math.round(Math.random()*100000000000).toString()
            diffList[i-1].name=flag
            diffList[i].name=flag
        }
        //分离文本
        if(diffList[i-1].removed===true){
            text1List.push(diffList[i-1])
        }else if(diffList[i-1].added===true){
            text2List.push(diffList[i-1])
        }else {
            text1List.push(diffList[i-1])
            text2List.push(diffList[i-1])
        }
    }
    //转换成字的list
    let res1=[]
    let res2=[]
    text1List.forEach((obj)=>{
        for (let char of obj.value){
            res1.push({'value':char,'diff':obj.diff,'added':obj.added,'removed':obj.removed,'order':obj.order,'name':obj.name})
        }
    })
    text2List.forEach((obj)=>{
        for (let char of obj.value){
            res2.push({'value':char,'diff':obj.diff,'added':obj.added,'removed':obj.removed,'order':obj.order,'name':obj.name})
        }
    })
    return {'charList1':res1,'charList2':res2}
}

//恢复替换的字和加上标点
export const recoverText=(charObjList1,charObjList2,originTextArr1,originTextArr2,signArr1,signArr2)=>{
    //先恢复字
    charObjList1.forEach((charObj,i,arr)=>{
        arr[i].value=originTextArr1[i]
    })
    charObjList2.forEach((charObj,i,arr)=>{
        arr[i].value=originTextArr2[i]
    })
    //插入符号value 和sign属性
    if(signArr1.length>0){
        signArr1.forEach((obj)=>{
            charObjList1.splice(obj.location,0,{'value':obj.value,'sign':true})
        })
    }
    if(signArr2.length>0){
        signArr2.forEach((obj)=>{
            charObjList2.splice(obj.location,0,{'value':obj.value,'sign':true})
        })
    }
    return {'originChars1':charObjList1,'originChars2':charObjList2}
}

//处理文本高亮
export const getDiffObjs=(text1,text2,ignore)=>{
    //0.忽略符号
    let text1SignObj={}
    let text2SignObj={}
    if(ignore.ignoreSign){
        let temp= clearSignStepOne(text1)
        text1SignObj=temp[0]//标点对象
        text1=temp[1]//去除标点的文本
        temp= clearSignStepOne(text2)
        text2SignObj=temp[0]//标点对象
        text2=temp[1]//去除标点的文本
    }
    //0.忽略表
    let ignoreTableRes1=ignoreTable(text1,ignore)
    let ignoreTableRes2=ignoreTable(text2,ignore)//originTextArr newText
    text1=ignoreTableRes1.newText//更新为替换后的文本
    text2=ignoreTableRes2.newText
    //获取diff区分出的文本的每个char的对象
    let charObjs=getDiffText(text1,text2)//charList1和charList2

    //恢复回原来的文本的char的对象
    let originChars= recoverText(charObjs.charList1,charObjs.charList2,ignoreTableRes1.originTextArr,ignoreTableRes2.originTextArr,text1SignObj,text2SignObj)

    return originChars
}
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
                    while (typeof (arr[i+j])!=="undefined" &&arr[i+j].sign){
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
//提取出第二段文本中的added
const extractAdded=(chars)=>{
    let orderSet=new Set()//添加的order的集合
    chars.forEach((obj)=>{
        if(obj.added&&!obj.diff){
            orderSet.add(obj.order)
        }
    })
    let resList=[]
    for (let order of orderSet){
        let temp=[]
        chars.forEach((obj)=>{
            if(obj.order===order){
                temp.push(obj)
            }
        })
        if(temp.length>0){
            resList.push(temp)
        }
    }
    return resList
}

const insertAdded=(chars1,addedList)=>{
    if(addedList.length<1){
        return chars1
    }
    addedList.forEach((orderChars)=>{
        //寻找插入位置
        let addedOrder=orderChars[0].order
        let targetLocation=0
        let flag=0
        for (let i=0;i<chars1.length;i++){
            if(addedOrder<=chars1[i].order){
                targetLocation=i
                flag=1
                break
            }
        }
        if(flag===0){
            //插入到最后
            targetLocation=chars1.length
        }
        //插入added
        orderChars.forEach((char,i)=>{
            chars1.splice(targetLocation+i,0,char)
        })
    })
    return chars1
}

const addHighlightAttribute=(obj)=>{
    //<a href="javascript:void(0);"name="1297" class="jiaodui">冠，贯也，所以贯韬发也。</a>
    if(obj.type==='diff'){
        return '<a href="javascript:void(0);" class="text-diff" name="'+obj.name+'">'+obj.value+'</a>';
    }else if(obj.type==='added'){
        return '<span class="text-added">'+obj.value+'</span>';
    }else if(obj.type==='removed'){
        return '<span class="text-removed">'+obj.value+'</span>';
    }else {
        return obj.value;
    }
}

/*
const addHighlight=(chars)=>{
    let highlightText=''
    chars.forEach((obj)=>{
        highlightText+=addHighlightAttribute(obj)
    })
    return highlightText
}
*/

const addHighlightType=(chars,type='all')=>{
    let highlightText=''
    chars.forEach((obj)=>{
        if(type==='diff'&&obj.type==='removed'){
            obj.type='common'
            highlightText+=addHighlightAttribute(obj)
        }else {
            highlightText+=addHighlightAttribute(obj)
        }

    })
    return highlightText
}

export const mergeTexts=(text1,text2,ignore,mergeType)=>{
    let originChars=getDiffObjs(text1,text2,ignore)
    let orderChars1=getSignOrder(originChars.originChars1)
    let orderChars2=getSignOrder(originChars.originChars2)
    let diffList=extractDiff(orderChars1,orderChars2)//提取diff内容
    let addedList=extractAdded(orderChars2)//提取added内容
    //合并
    let mergeText=orderChars1

    if(mergeType!=='diff'){
        let mergeText= insertAdded(orderChars1,addedList)
    }
    let sameAttributeTexts= mergeSame(mergeText)//TODO 这里可以优化，让added removed周围的符号也变成一个类型
    //添加高亮

    let htmlText=addHighlightType(sameAttributeTexts,mergeType)
    return {'html':htmlText,'diffList':diffList}

}

export const mergeHtml=(htmlList)=>{
    //首先对每一段加上一个p标签
    let paragraphs=[]
    htmlList.forEach((paraList)=>{
        let str='<p class="para-style">'
        paraList.forEach((line)=>{
            str+=line
        })
        str+='</p>\n'
        paragraphs.push(str)
    })
    const templateHtml1='<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '    <meta charset="UTF-8">\n' +
        '    <meta http-equiv="X-UA-Compatible" content="IE=edge">\n' +
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
        '</head>\n' +
        '<body>\n'
    const templateHtml2='</body>\n' +
        '</html>'

    let html=''
    paragraphs.forEach((p)=>{
        html+=p
    })
    html=templateHtml1+html+templateHtml2
    return html
}



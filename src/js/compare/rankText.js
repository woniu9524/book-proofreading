/*
* 排序找到底稿所对应的校对文本所对应的句子
* 起始窗口，最大窗口，一级阈值【认为正确】，二级阈值【大概正确】，三级阈值【不正确】
*
* 首先从起始窗口大小开始比较，如果阈值过低，阈值范围扩大，继续比较直到达到最大窗口，选出相似度最高的作为结果
* 如果比较结果大于阈值上限，则设置新的比较位置为此处
*
* 二次扫描：每连续两个大于阈值上限的行就认为此处一定正确，读取出这样的列表【确定点，……，确定点，……，确定点】
* 接着，对确定点之间的行进行二次扫描，扫描之后如果有变化，更新变化，对变化的部分的左右段落进行第三次扫描，以此类推。
*
*
* */
import {computeCosSimilar} from './computeSimilar'
//设置最大窗口
export const setWindow=(win)=>{
    if(win<3)
        win=3
    else if(win%2===0)
        win+=1
    return win
}

//递归判断
export const compareRecursion=(start,end,s1,arr2,thresholdOne,thresholdTwo,thresholdThree,similar0,flag,sign,ignoreSign=true,ignoreYi=false,ignoreFan=false)=>{
    //递归出口
    if(sign==='+'){
        if (start>=end){
            //结束
            if(similar0<thresholdThree){
                return [s1,[-1,-1,s1[2]],-1,0]
            }else {
                return [s1,arr2[flag],similar0,0]
            }
        }
    }else {
        if(start<=end){
            //结束
            if(similar0<thresholdThree){
                return [s1,[-1,-1,s1[2]],-1,0]
            }else {
                return [s1,arr2[flag],similar0,0]
            }
        }
    }
    //递归内容
    let flagHasChange=0
    for (let i=1;i<=2;i++){
        //每比较两个判断一次
        if(sign==='+'){
            if(start+i<end){
                let similar=computeCosSimilar(s1[2],arr2[start+i][2],ignoreSign,ignoreYi,ignoreFan)
                if(similar>similar0){
                    similar0=similar
                    flag=start+i
                    flagHasChange=1
                }
            }
        }else {
            if(start-i>end){

                let similar=computeCosSimilar(s1[2],arr2[start-i][2],ignoreSign,ignoreYi,ignoreFan)
                if(similar>similar0){
                    similar0=similar
                    flag=start-i
                    flagHasChange=1
                }
            }
        }
    }
    //判断
    if(flagHasChange===1){
        //相似度发生了变化，判断是否结束
        if(similar0>thresholdOne&&s1[2].length>=5){
            return [s1,arr2[flag],similar0,flag]//相似度高于thresholdOne且比较的字符串长度大于5加入正确的列表中
        }else if(similar0>thresholdOne){
            return [s1,arr2[flag],similar0,0]//相似度高于thresholdOne
        }else if(similar0>thresholdTwo&&s1[2].length>=5){
            return [s1,arr2[flag],similar0,0]
        }
    }
    if(sign==='+')
        start+=2
    else
        start-=2
    return compareRecursion(start,end,s1,arr2,thresholdOne,thresholdTwo,thresholdThree,similar0,flag,sign)

}

//比较一段窗口取出相似度最高的
export const compareByWindowSize=(addStart,subStart,addEnd,subEnd,s1,arr2,thresholdOne,thresholdTwo,thresholdThree,similar0,ignoreSign=true,ignoreYi=false,ignoreFan=false)=>{
    //text1和arr2的【addStart-》addEnd】和【subStart-》subEnd】进行比较
    //当相似度高于thresholdTwo且比较的字符串长度大于5时认为是正确的
    //当相似度高于thresholdOne且比较的字符串长度大于5加入正确的列表中，否则只认为是正确的
    let resArr1=compareRecursion(addStart,addEnd,s1,arr2,thresholdOne,thresholdTwo,thresholdThree,similar0,addStart,'+')
    let resArr2=compareRecursion(subStart,subEnd,s1,arr2,thresholdOne,thresholdTwo,thresholdThree,similar0,subStart,'-')
    return resArr1[2]>resArr2[2]?resArr1:resArr2
}

export const rankSentence=(sentenceList1,sentenceList2,maxWin=100,thresholdOne=0.9,thresholdTwo=0.7,thresholdThree=0.3,ignoreSign=true,ignoreYi=false,ignoreFan=false)=>{
    //sentenceList结构[  [paragraphLocation,sentenceLocation,sentence],……  ]

    //将窗口设置成奇数
    maxWin=setWindow(maxWin)
    let halfWin=Math.floor((maxWin+1)/2)
    //第一次比较
    let startLocation=0//起始比较位置
    let rightLocationList=[]//记录起始比较位置产生时候的位置
    let resultList=[]//接收排序的结果
    sentenceList1.forEach((s1,i,arr1)=>{
        // debugger
        if(startLocation>sentenceList2.length){
            //如果已经超出了sentenceList2的结尾了，设置相似度和位置位-1,不再比较
            resultList.push([s1,[-1,-1,s1[2]],-1])
        }else{
            let similar0=computeCosSimilar(s1[2],sentenceList2[startLocation][2],ignoreSign,ignoreYi,ignoreFan)
            // debugger
            if(similar0>=thresholdOne){
                //大于thresholdOne认为是可靠的,添加进结果list中，并且更新起始位置
                resultList.push([s1,sentenceList2[startLocation],similar0])
                rightLocationList.push([i,startLocation])//加入到正确位置数组中
                startLocation++
            }else{
                let subEnd=0;
                if(rightLocationList.length>0){
                    // debugger
                    subEnd=(startLocation-halfWin)<rightLocationList.slice(-1)[0][1]?rightLocationList.slice(-1)[0][1]:(startLocation-halfWin)//下限
                }
                let addEnd=(startLocation+halfWin)<sentenceList2.length-1?(startLocation+halfWin):sentenceList2.length-1//上限
                let resArr=compareByWindowSize(startLocation,startLocation,addEnd,subEnd,s1,sentenceList2,thresholdOne,thresholdTwo,thresholdThree,similar0,ignoreSign,ignoreYi,ignoreFan)
                resultList.push([resArr[0],resArr[1],resArr[2]])
                if(resArr[3]>0){
                    rightLocationList.push([i,resArr[3]])//添加到正确的列表
                    startLocation=resArr[3]
                }
                startLocation++
            }
        }
    })
    //TODO 根据rightLocationList，进行二次，三次……扫描


    return  resultList
}
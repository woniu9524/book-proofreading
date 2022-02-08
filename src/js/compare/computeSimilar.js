/*
* 计算相似度，这里使用余弦相似度
* */
import {charFanToJian,charYiToFan} from './translate'
//除去标点和空格
export const removeSign=(charList)=>{
    return  charList.filter((char) => {
        char= char.trim(); //除去首尾空格
        if (char !== '') {
            //不是全为空格
            let sign = "!#$%&()*+,-./:;<=>?@[]^_`{|}~“”？，！•【】『』〖〗〔〕〈〉〔〕「」（）、。：；’‘……￥·●○§《》 　\t︰";
            if (sign.indexOf(char) === -1) {
                //不是符号
                return true
            }
        }
        return false
    })
}

//计算字向量
export const computeWordVector=(allCharVector,charVector)=>{
    let b = []
    allCharVector.forEach((text0, i) => {
        let flag = 0;
        charVector.forEach((text1) => {
            if (flag === 0) {
                //第一次进入循环
                b[i] = 0;
                flag = 1;
            }
            if (text0 === text1) {
                b[i]++;
            }
        })
    })
    return b
}

//计算字向量的余弦相似度
export const computeWordVectorSimilar=(b1,b2)=>{
    let up = 0;
    let down_left = 0;
    let down_right = 0;
    for (let i = 0; i < b1.length; i++) {
        up += b1[i] * b2[i];
        down_left += b1[i] * b1[i];
        down_right += b2[i] * b2[i];
    }
    down_left = Math.sqrt(down_left);
    down_right = Math.sqrt(down_right);
    let cos = 0;
    let down = down_left * down_right;
    if (down !== 0) {
        cos = (up / down).toFixed(5);
    }
    return cos;
}

//计算两段文本的余弦相似度
export const computeCosSimilar=(text1, text2,ignoreSign=true,ignoreYi=false,ignoreFan=false)=> {
    //分字
    let charList1 = [];
    let charList2 = [];
    for (let char of text1) {
        charList1.push(char);
    }
    for (let char of text2) {
        charList2.push(char);
    }
    //除去标点和空格
    if(ignoreSign){
        charList1=removeSign(charList1)
        charList2=removeSign(charList2)
    }
    //忽略异体字
    if(ignoreYi){
        charList1.forEach((char,index)=>{
            charList1[index]=charYiToFan(char)
        })
        charList2.forEach((char,index)=>{
            charList2[index]=charYiToFan(char)
        })
    }
    //忽略繁体字
    if(ignoreFan){
        charList1.forEach((char,index)=>{
            charList1[index]=charFanToJian(char)
        })
        charList2.forEach((char,index)=>{
            charList2[index]=charFanToJian(char)
        })
    }
    //转换成字向量
    let allCharList = Array.from(new Set(charList1.concat(charList2))); //两段文本合并后去重
    let b1=computeWordVector(allCharList,charList1)
    let b2=computeWordVector(allCharList,charList2)
    //计算相似度
    let res=computeWordVectorSimilar(b1,b2)
    return isNaN(res)?-1:res//防止出现一个为空的情况(没想到真的能遇上，离谱)
}

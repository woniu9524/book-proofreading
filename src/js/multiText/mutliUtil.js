export const genCombinationText=(m,n)=>{
    // 将n以m个为一组进行组合
    let textListGroup=[];
    for(let i=0;i<n-m+1;i++){
        for(let j=i+1;j<n-m+2;j++){
            let temp=[i];
            for (let k=0;k<m-1;k++){
                temp.push(j+k)
            }
            textListGroup.push(temp);
        }
    }
    return textListGroup;
}

export const getIntersectionAndDiff=(ids,texts,stopWords)=>{
    debugger
    // eg: ids=[1,2,3]
    // texts預處理
    let textList=[];
    stopWords=stopWords.split('');
    ids.forEach(id=>{
        stopWords.forEach(stopWord=>{
            texts[id]=texts[id].replace(/(\r\n|\n|\r)/gm , '');
            texts[id]=texts[id].replace(eval('/'+stopWord.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')+'/g'),'')
        })
        textList.push(texts[id].split(''))
    })
    // 词频统计
    let freqList=[];
    textList.forEach(text=>{
        let wordCount={};
        let allCount=0;
        text.forEach(word=>{
            if(wordCount[word]){
                wordCount[word]+=1
            }else{
                wordCount[word]=1
            }
            allCount+=1
        })
        for(let word in wordCount){
            wordCount[word]=[wordCount[word],(wordCount[word]/allCount).toFixed(5)]
        }
        freqList.push(wordCount)
    })
    // 交集
    let intersectionList=[];
    freqList.forEach((freq,index)=>{
        let intersection={};
        for(let word in freq){
            let flag=true;
            freqList.forEach((freq2,index2)=>{
                if(index!==index2){
                    if(!freq2[word]){
                        flag=false
                    }
                }
            })
            if(flag){
                intersection[word]=freq[word]
            }
        }
        intersectionList.push(intersection)
    })
    // 全不相同
    let diffList=[];
    freqList.forEach((freq,index)=>{
        let diff={};
        for(let word in freq){
            let flag=true;
            freqList.forEach((freq2,index2)=>{
                if(index!==index2){
                    if(freq2[word]){
                        flag=false
                    }
                }
            })
            if(flag){
                diff[word]=[freq[word],index]
            }
        }
        diffList.push(diff)
    })
    // 返回
    return {intersection:intersectionList,diff:diffList}

}

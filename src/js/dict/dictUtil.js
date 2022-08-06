// //移除无用字符
export const removeWords=(removeWords,texts)=>{
    removeWords=removeWords+' \r';
    let removeList=removeWords.split("");
    removeList.forEach((ch)=>{
        let newTexts="";
        for(let i=0;i<texts.length;i++){
            let word=texts.charAt(i);
            if(word!==ch){
                newTexts+=word;
            }
        }
        texts=newTexts;
    })
    return texts;
}
//按照符号断句
export const splitBySigns=(splitSigns,texts)=>{
    let textList=texts.split('\n');
    let tempList=[];
    for(let i=0;i<splitSigns.length;i++){
        let sign=splitSigns.charAt(i);
        textList.forEach((text)=>{
            tempList=tempList.concat(text.split(sign));
        })
        textList=tempList;
        tempList=[];
    }
    return textList;
}

export const makeDict=(removedChars,filterWords,textList)=>{
    //将filterWords变成列表，分隔符就用|
    let filterList=filterWords.split('|');
    //建立字典
    let wordDic={}
    textList.forEach((line)=>{
        filterList.forEach((reg)=>{
            line=line.replace(eval("/"+reg+"/ig"),'');
        })
        line=removeWords(removedChars,line);
        for (let i=0;i<line.length;i++){
            wordDic[line.charAt(i)]=[];
        }
    })
    return wordDic;
}

export const makeInvertedIndex=(removedChars,splitSigns,filterWords,minLength,texts)=>{
    let textList=splitBySigns(splitSigns,texts);
    let wordDic=makeDict(removedChars,filterWords,textList);

    textList.forEach((line)=>{
        if(line.length>=minLength){
            for (let i = 0; i < line.length; i++) {
                let word = line.charAt(i);
                if(word in wordDic){
                    wordDic[word].push(line);
                }
            }
        }
    })
    console.log(wordDic);
    return wordDic;
}

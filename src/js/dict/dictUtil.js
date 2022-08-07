// //移除无用字符
export const removeWords = (removeWords, texts) => {
    removeWords = removeWords + ' \r';
    let removeList = removeWords.split("");
    removeList.forEach((ch) => {
        let newTexts = "";
        for (let i = 0; i < texts.length; i++) {
            let word = texts.charAt(i);
            if (word !== ch) {
                newTexts += word;
            }
        }
        texts = newTexts;
    })
    return texts;
}
//按照符号断句
export const splitBySigns = (splitSigns, texts) => {
    let textList = texts.split('\n');
    let tempList = [];
    for (let i = 0; i < splitSigns.length; i++) {
        let sign = splitSigns.charAt(i);
        textList.forEach((text) => {
            tempList = tempList.concat(text.split(sign));
        })
        textList = tempList;
        tempList = [];
    }
    return textList;
}

export const makeDict = (removedChars, filterWords, textList) => {
    //将filterWords变成列表，分隔符就用|
    let filterList = filterWords.split('|');
    //建立字典
    let wordDic = {}
    textList.forEach((line) => {
        filterList.forEach((reg) => {
            line = line.replace(eval("/" + reg + "/ig"), '');
        })
        line = removeWords(removedChars, line);
        for (let i = 0; i < line.length; i++) {
            wordDic[line.charAt(i)] = [];
        }
    })
    return wordDic;
}

export const makeInvertedIndex = (removedChars, splitSigns, filterWords, minLength, texts) => {
    let textList = splitBySigns(splitSigns, texts);
    let wordDic = makeDict(removedChars, filterWords, textList);
    textList.forEach((line) => {
        if (line.length >= minLength) {
            for (let i = 0; i < line.length; i++) {
                let word = line.charAt(i);
                if (word in wordDic) {
                    wordDic[word].push(line);
                }
            }
        }
    })

    let dictList = [];
    let count = 0;
    for (let key in wordDic) {
        count++;
        dictList.push({
            id: count,
            name: key,
            textList: [...new Set(wordDic[key])]
        })
    }
    //console.log(dictList)
    return dictList;
}

//生成组合
export const permute = (array) => {
    let res = []
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = i + 1; j < array.length; j++) {
            res.push([array[i], array[j]])
        }
    }
    return res;
}

export const genGraphData = (dictList, minSize = 20, maxSize = 50, nodeNums = -1) => {
    let nodes = [];//id,label,size
    let edges = [];//source,target,size
    let data = {
        nodes: [],
        edges: []
    };
    //先对dictList从大到小排序
    dictList.sort((a, b) => {
        return b.textList.length - a.textList.length
    })
    console.log(dictList)
    //处理nodeNums
    if (nodeNums === -1 || nodeNums > dictList.length) {
        nodeNums = dictList.length;
    }
    //计算权重系数
    let minNum = 999999;
    let maxNum = 0;
    for (let i = 0; i < nodeNums; i++) {
        if (dictList[i].textList.length < minNum) {
            minNum = dictList[i].textList.length;
        }
        if (dictList[i].textList.length > maxNum) {
            maxNum = dictList[i].textList.length;
        }
    }
    let ratio = (maxSize - minSize) / (maxNum - minNum);
    // debugger
    //生成点
    for (let i = 0; i < nodeNums; i++) {
        nodes.push({
            //id,label,size
            id: String(dictList[i].id),
            label: dictList[i].name,
            size: Math.round(dictList[i].textList.length * ratio) + minSize
        })
    }
    //生成边
    //先获取所有句子
    let allTexts = []
    for (let i = 0; i < nodeNums; i++) {
        dictList[i].textList.forEach((line) => {
            allTexts.push(line)
        })
    }
    allTexts = [...new Set(allTexts)]
    //获取正排序列
    let rankList = []
    allTexts.forEach((line) => {
        let tempList = []
        for(let k=0;k<nodeNums;k++){
            if (dictList[k].textList.indexOf(line) !== -1) {
                tempList.push(String(dictList[k].id));
            }
        }
        rankList.push(tempList);
    })
    //制作边集
    for (let i = 0; i < rankList.length; i++) {
        let permuteList = permute(rankList[i]);
        permuteList.forEach((lst) => {
            //source,target,size
            let flag = 0;
            for (let j = 0; j < edges.length; j++) {
                if (edges[j].source === lst[0] && edges[j].target === lst[1]) {
                    edges[j].size = edges[j].size + 1;
                    flag = 1;
                    break
                }
            }
            if (flag === 0) {
                edges.push({
                    source: lst[0],
                    target: lst[1],
                    size: 1
                })
            }
        })
    }
    //移除一些边
    let newEdges=[]
    edges.forEach((edge)=>{
        edge.size=Math.round(edge.size/20)
        if(edge.size>0){
            newEdges.push(edge)
        }
    })
    //合并
    data.edges=newEdges;
    data.nodes=nodes;
    console.log(data);
    return data
}

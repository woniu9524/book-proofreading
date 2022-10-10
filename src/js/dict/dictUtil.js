// //移除无用字符
import {pinyin} from "pinyin-pro";
const kmeans = require('ml-kmeans');

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
    texts = texts.replace(/？）/g, "asdfghj");
    let textList = texts.split('\n');
    //两个的，优先级高[]括起来
    let exp = /\[.*?]/g;
    let result;
    let high_sign = []
    while ((result = exp.exec(splitSigns)) != null) {
        high_sign.push(result);
    }
    splitSigns = splitSigns.replace(/\[.*?]/g, '')
    high_sign.forEach((sign, index) => {
        high_sign[index] = sign[0].replace(/\[/g, '').replace(/]/g, '')
    })
    high_sign = high_sign.reverse()
    let tempList = [];
    let splitSignList = splitSigns.split('')
    high_sign.forEach((sign) => {
        splitSignList.unshift(sign)
    })
    // debugger
    for (let i = 0; i < splitSignList.length; i++) {
        let sign = splitSignList[i];
        textList.forEach((text) => {
            tempList = tempList.concat(text.split(sign));
        })
        textList = tempList;
        tempList = [];
    }
    textList.forEach((line, index, array) => {
        textList[index] = line.replace(/asdfghj/g, '？）');
    })
    return textList;
}

export const makeDict = (removedChars, filterWords, textList) => {
    //将filterWords变成列表，分隔符就用||
    let filterList = filterWords.split('||');
    //建立字典
    let wordDic = {}
    textList.forEach((line) => {
        filterList.forEach((reg) => {
            line = line.replace(eval("/" + reg + "/ig"), '');
        })
        line = removeWords(removedChars, line);
        for (let i = 0; i < line.length; i++) {
            //一个字分成两部分的情况
            if (line.charAt(i) === '[') {
                i++;
                let temp_word = ""
                while (line.charAt(i) !== ']') {
                    temp_word += line.charAt(i);
                    i++;
                }
                wordDic[temp_word] = [];
            } else {
                wordDic[line.charAt(i)] = [];
            }

        }
    })
    return wordDic;
}

export const makeInvertedIndex = (removedChars, splitSigns, filterWords, minLength, texts) => {
    //把文本分成篇章
    let lines = texts.split("\n");
    let textDic = {}
    let title = ''
    lines.forEach((line) => {
        if (line.match(/《.*?》/) != null && line.match(/《.*?》/)['index'] === 0 && line.replace(/《.*?》/, '').length < 3) {
            title = line.match(/《.*?》/)[0]
            textDic[title] = ''
        } else {
            textDic[title] += line
        }
    })

    let dictList = [];
    for (let bookName in textDic) {
        let oneBook = textDic[bookName]

        let textList = splitBySigns(splitSigns, oneBook);
        let wordDic = makeDict(removedChars, filterWords, textList);
        //将filterWords变成列表，分隔符就用||
        let filterList = filterWords.split('||');
        // debugger
        textList.forEach((line) => {
            let originLine = line;
            filterList.forEach((reg) => {
                line = line.replace(eval("/" + reg + "/ig"), '');
            })
            line = removeWords(removedChars, line);
            if (line.length >= minLength) {
                let has_in_word = []
                for (let i = 0; i < line.length; i++) {
                    let word;
                    if (line.charAt(i) === '[') {
                        i++;
                        let temp_word = ""
                        while (line.charAt(i) !== ']') {
                            temp_word += line.charAt(i);
                            i++;
                        }
                        word = temp_word;
                    } else {
                        word = line.charAt(i);
                    }
                    if ((word in wordDic) && !has_in_word.includes(word)) {
                        // debugger
                        // originLine=originLine.replace(/\[/g,'')
                        // originLine=originLine.replace(/]/g,'')
                        wordDic[word].push(originLine);
                        has_in_word.push(word)
                    }
                }
            }
        })

        function frequencies(/* {Array} */ a) {
            return new Map([...new Set(a)].map(
                x => [[x, {isClicked: false}], a.filter(y => y === x).length]
            ));
        }

        for (let key in wordDic) {
            // debugger
            let tempList = []
            frequencies(wordDic[key]).forEach(function (value, key) {
                tempList.push([value, key])
            })
            wordDic[key] = tempList
        }
        // debugger
        let count = 0;
        for (let key in wordDic) {
            count++;

            dictList.push({
                id: count,
                name: key,
                title: bookName,
                initial: pinyin(key, {toneType: 'none', type: 'array'})[0],
                textList: wordDic[key]
            })
        }
    }
    //合并多本书
    let wordSet = new Set();
    let newDict = new Map()
    dictList.forEach((obj) => {
        if (newDict.get(obj.name) !== undefined) {
            let tempList = []
            obj.textList.forEach((v, k) => {
                tempList.push({
                    word: obj.name,
                    title: obj.title,
                    initial: obj.initial,
                    nums: v,
                    text: k,
                    isClicked: false
                })
            })
            newDict.set(obj.name, newDict.get(obj.name).concat(tempList))

        } else {
            //重新整理格式
            let tempList = []
            obj.textList.forEach((v, k) => {
                tempList.push({
                    word: obj.name,
                    title: obj.title,
                    initial: obj.initial,
                    nums: v,
                    text: k,
                    isClicked: false
                })
            })
            newDict.set(obj.name, tempList)
        }
    })

    let count=0
    let newDictList=[]
    newDict.forEach((lineList,key)=>{
        count++
        if (lineList.length>0){
            let newLineList=[]
            lineList.forEach((line)=>{
                newLineList.push([line.nums[0],line.nums[1],line.title])
            })

            newDictList.push({
                id:count,
                name:key,
                initial:lineList[0].initial,
                textList: newLineList

            })
        }
    })

    newDictList.forEach((line,index)=>{
        try {
            newDictList[index].textList=clustering(line.textList,5,line.name)
        }catch (e) {
            console.log("~~~")
        }
    })
    debugger
    // return dictList
    return newDictList;
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
        for (let k = 0; k < nodeNums; k++) {
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
    let newEdges = []
    edges.forEach((edge) => {
        edge.size = Math.round(edge.size / 20)
        if (edge.size > 0) {
            newEdges.push(edge)
        }
    })
    //合并
    data.edges = newEdges;
    data.nodes = nodes;
    console.log(data);
    return data
}

export const makeKeywordDict = (settingForm, text, keyword) => {
    /*
    splitInput:"，。；？",
    keywordSplitInput:"",
    minLength:0,
    */
    //keyword分词
    keyword = keyword.replace(/\r/g, '');
    let keywordList = keyword.split('\n');
    let keywordSplit = settingForm.keywordSplitInput + ' ';
    let keywordSplitSigns = keywordSplit.split('');

    keywordSplitSigns.forEach((sign) => {
        let tempList = []
        keywordList.forEach((keyword) => {
            tempList = tempList.concat(keyword.split(sign));
        })
        keywordList = tempList;
        tempList = [];
    })
    keywordList = [...new Set(keywordList)];

    //把文本分成篇章
    let lines = text.split("\n");
    let textDic = {}
    let title = ''
    lines.forEach((line) => {
        if (line.match(/《.*?》/) != null && line.match(/《.*?》/)['index'] === 0 && line.replace(/《.*?》/, '').length < 3) {
            title = line.match(/《.*?》/)[0]
            textDic[title] = ''
        } else {
            textDic[title] += line
        }
    })

    function frequencies(/* {Array} */ a) {
        return new Map([...new Set(a)].map(
            x => [[x, {isClicked: false}], a.filter(y => y === x).length]
        ));
    }

    let resList = [];
    for (let bookName in textDic) {
        let oneBook = textDic[bookName]

        //text分句
        let textList = splitBySigns(settingForm.splitInput, oneBook);
        //整合
        let count = 0;
        keywordList.forEach((keyword) => {
            count++;
            let tempTextList = []
            textList.forEach((line) => {
                if (line.indexOf(keyword) >= 0) {
                    tempTextList.push(line);
                }
            })
            if (tempTextList.length > 0) {

                let tempList = []
                frequencies(tempTextList).forEach(function (value, key) {
                    tempList.push([value, key])
                })

                resList.push({
                    id: count,
                    title: bookName,
                    name: keyword,
                    initial: pinyin(keyword, {toneType: 'none', type: 'array'})[0],
                    textList: tempList
                })
            }
        })

    }


    //合并多本书
    let newDict = new Map()
    resList.forEach((obj) => {
        if (newDict.get(obj.name) !== undefined) {
            let tempList = []
            obj.textList.forEach((v, k) => {
                tempList.push({
                    word: obj.name,
                    title: obj.title,
                    initial: obj.initial,
                    nums: v,
                    text: k,
                    isClicked: false
                })
            })
            newDict.set(obj.name, newDict.get(obj.name).concat(tempList))

        } else {
            //重新整理格式
            let tempList = []
            obj.textList.forEach((v, k) => {
                tempList.push({
                    word: obj.name,
                    title: obj.title,
                    initial: obj.initial,
                    nums: v,
                    text: k,
                    isClicked: false
                })
            })
            newDict.set(obj.name, tempList)
        }
    })

    let count=0
    let newDictList=[]
    newDict.forEach((lineList,key)=>{
        count++
        if (lineList.length>0){
            let newLineList=[]
            lineList.forEach((line)=>{
                newLineList.push([line.nums[0],line.nums[1],line.title])
            })

            newDictList.push({
                id:count,
                name:key,
                initial:lineList[0].initial,
                textList: newLineList

            })
        }
    })
    debugger
    return newDictList
    // return resList;
}

export const sortSentences=(textList)=>{
    // 生成数据
    let wordMap=new Map();
    let count=0
    let numList=[]

    textList.forEach((line)=>{
        let numLine=[]
        line.split('').forEach((word)=>{
            if (!wordMap.has(word)){
                wordMap.set(word,count);
                count++;
            }
            numLine.push(wordMap.get(word));
        })
        numList.push(numLine);
    })

    // 生成领接矩阵
    let mat=new Array(numList.length);
    for (let i = 0; i < mat.length; i++) {
        mat[i]=new Array(numList.length);
        for (let j = 0; j < mat[i].length; j++) {
            if (i===j){
                mat[i][j]=0;
            }else {
                mat[i][j]=-1;
            }
        }
    }
    // 计算余弦相似度
    for (let i = 0; i < numList.length; i++) {
        for (let j = i+1; j < numList.length; j++) {
            mat[i][j]=Number(computeWordVectorSimilar(numList[i],numList[j]));
            mat[j][i]=mat[i][j]
        }
    }
    //贪心寻找结果
    return tanxin(mat);
    // // 迪杰斯特拉找最大路径
    // let res=dijkstra(mat);
    // //返回顺序
    // return res;

}

export const clustering=(textList,centerNum,name)=>{
    try{
        let lineList=[]
        let minlength=99999;
        textList.forEach((line)=>{
            if (line[1][0].length<minlength){
                minlength=line[1][0].length;
            }
        })
        textList.forEach((line)=>{
            lineList.push(sliceLine(line[1][0],name,minlength))
        })
        let sortList=sortSentences(lineList)
        // 将原来列表顺序换成sortList的顺序
        let newTextList=new Array(textList.length);
        for (let i = 0; i < sortList.length; i++) {
            newTextList[sortList[i]]=textList[i]
        }
        return newTextList;
    }catch (e){
        return textList;
    }


}

export const sliceLine=(line,name,num)=>{
    let nameIndex=line.search(name);
    if (nameIndex===-1){
        return line.slice(0,num)
    }
    let start=Math.floor((num-1)/2)+(num-1)%2;
    let end=Math.floor((num-1)/2)+1;
    start=nameIndex-start;
    end=nameIndex+end;
    if (start<0){
        end-=start;
        start=0;
    }else if(end>line.length){
        start-=(end-line.length);
        end=line.length;
    }
    if ((end-start)!==num||(end-line.length)>0||start===-1){
        debugger
    }
    return line.slice(start,end)
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

export const dijkstra=(matrix)=>{
    debugger
    let res=[0];
    let dis=new Array(matrix.length)
    for (let i = 0; i < dis.length; i++) {
        dis[i]=0;
    }
    matrix.forEach((line)=>{
        for (let i = 0; i < line.length; i++) {
            if(line[i]!==-1){
                dis[i]+=line[i];
            }
        }
        let max=0
        let loc=-1
        for (let i = 0; i < dis.length; i++) {
            if (res.indexOf(i)<0){
                if(dis[i]>max){
                    max=dis[i];
                    loc=i;
                }
            }
        }
        if(loc!==-1){
            res.push(loc)
        }
    })
    return res;
}

export const tanxin=(mat)=>{
    let res=[0]
    let i=0
    while (true){
        let loc=-1;
        let max=0;
        for(let j=0;j<mat[i].length;j++){
            if(res.indexOf(j)<0&&j!==i&&mat[i][j]>=max){
                max=mat[i][j]
                loc=j
            }
        }
        if(loc===-1){
            break
        }
        res.push(loc)
        i=loc
    }
    return res
}

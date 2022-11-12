import {permute} from "../dict/dictUtil";

export const genCombinationText = (m, n) => {
    // 将n以m个为一组进行组合
    let textListGroup = [];
    for (let i = 0; i < n - m + 1; i++) {
        for (let j = i + 1; j < n - m + 2; j++) {
            let temp = [i];
            for (let k = 0; k < m - 1; k++) {
                temp.push(j + k)
            }
            textListGroup.push(temp);
        }
    }
    return textListGroup;
}

export const getIntersectionAndDiff = (ids, texts, stopWords) => {
    debugger
    // eg: ids=[1,2,3]
    // texts預處理
    let textList = [];
    stopWords = stopWords.split('');
    ids.forEach(id => {
        stopWords.forEach(stopWord => {
            texts[id] = texts[id].replace(/(\r\n|\n|\r)/gm, '');
            texts[id] = texts[id].replace(eval('/' + stopWord.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '/g'), '')
        })
        textList.push(texts[id].split(''))
    })
    // 词频统计
    let freqList = [];
    textList.forEach(text => {
        let wordCount = {};
        let allCount = 0;
        text.forEach(word => {
            if (wordCount[word]) {
                wordCount[word] += 1
            } else {
                wordCount[word] = 1
            }
            allCount += 1
        })
        for (let word in wordCount) {
            wordCount[word] = [wordCount[word], (wordCount[word] / allCount).toFixed(5)]
        }
        freqList.push(wordCount)
    })
    // 交集
    let intersectionList = [];
    freqList.forEach((freq, index) => {
        let intersection = {};
        for (let word in freq) {
            let flag = true;
            freqList.forEach((freq2, index2) => {
                if (index !== index2) {
                    if (!freq2[word]) {
                        flag = false
                    }
                }
            })
            if (flag) {
                intersection[word] = [freq[word], index]
            }
        }
        intersectionList.push(intersection)
    })
    // 全不相同
    let diffList = [];
    freqList.forEach((freq, index) => {
        let diff = {};
        for (let word in freq) {
            let flag = true;
            freqList.forEach((freq2, index2) => {
                if (index !== index2) {
                    if (freq2[word]) {
                        flag = false
                    }
                }
            })

            if (flag) {
                diff[word] = [freq[word], index]
            }
        }
        diffList.push(diff)
    })
    // 返回
    return {intersection: intersectionList, diff: diffList}

}

export const genMutliTextGraphData = (table, titles, minSize = 20, maxSize = 300, nodeNums = -1) => {
    let nodes = [];//id,label,size
    let edges = [];//source,target,size
    let data = {
        nodes: [],
        edges: []
    };
    let sizeMap = {};
    let ratioMap = {};
    table.forEach((row, index) => {
        row.intersection.forEach((equalLine) => {
            let weight = equalLine[1];
            let ratio = equalLine[2];
            row.ids.forEach((id) => {
                if (!sizeMap[id]) {
                    sizeMap[id] = 0;
                }
                sizeMap[id] += weight;
            })
            if (!ratioMap[row.ids[0] + '-' + row.ids[1]]) {
                ratioMap[row.ids[0] + '-' + row.ids[1]] = 0;
            }
            ratioMap[row.ids[0] + '-' + row.ids[1]] += parseFloat(ratio);

        });
        row.diff.forEach((diffLine) => {
            let weight = diffLine[1];
            let ratio = diffLine[2];
            let id = diffLine[3];
            if (!sizeMap[id]) {
                sizeMap[id] = 0;
            }
            sizeMap[id] += weight;
            if (!ratioMap[row.ids[0] + '-' + row.ids[1]]) {
                ratioMap[row.ids[0] + '-' + row.ids[1]] = 0;
            }
            ratioMap[row.ids[0] + '-' + row.ids[1]] -= parseFloat(ratio);
        });
        edges.push({
            source: String(row.ids[0]),
            target: String(row.ids[1]),
            size: ratioMap[row.ids[0] + '-' + row.ids[1]],
        });
    });

    // 处理size大小
    let sum = 0;
    for (let id in sizeMap) {
        sum += sizeMap[id];
    }
    for (let id in sizeMap) {
        let size = sizeMap[id] / sum;
        sizeMap[id] = minSize + Math.round((maxSize - minSize) * size);
    }
    for (let sizeMapKey in sizeMap) {
        nodes.push({
            id: String(sizeMapKey),//必须是字符串
            label: titles[sizeMapKey],//TODO 不确定
            size: sizeMap[sizeMapKey],
        });
    }
    // 对ratioMap进行归一化
    let max = 0;
    let min = 0;
    for (let ratioMapKey in ratioMap) {
        if (ratioMap[ratioMapKey] > max) {
            max = ratioMap[ratioMapKey];
        }
        if (ratioMap[ratioMapKey] < min) {
            min = ratioMap[ratioMapKey];
        }
    }
    for (let ratioMapKey in ratioMap) {
        ratioMap[ratioMapKey] = Math.round(((ratioMap[ratioMapKey] - min) / (max - min)*10));
    }
    edges.forEach((edge,index) => {
        edges[index].size = ratioMap[edge.source + '-' + edge.target];
    })
    // 只保留最大的编码
    let newEdges = [];
    let edgeMap = {};
    edges.forEach((edge) => {
        if(!edgeMap[edge.source]){
            edgeMap[edge.source] = {
                source:edge.source,
                target:edge.target,
                size:edge.size,
            };
        }else if(edgeMap[edge.source].size < edge.size){
            edgeMap[edge.source] = {
                source:edge.source,
                target:edge.target,
                size:edge.size,
            };
        }
    })
    for(let edgeMapKey in edgeMap){
        newEdges.push(edgeMap[edgeMapKey]);
    }
    //合并
    data.edges = newEdges;
    data.nodes = nodes;
    console.log(data);
    return data
}

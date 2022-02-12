/*
* 1.分词统计idf
*
* */
import {computeCosSimilar, computeCosSimilarForBookCompare} from "../compare/computeSimilar";

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择
const adapter = new FileSync('./DATAS/db.json'); // 申明一个适配器
const db = low(adapter);


const removeSign = (charList) => {
    return charList.filter((char) => {
        char = char.trim(); //除去首尾空格
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

const removeStopChar = (chars) => {
    let stop = db.get('stop').value()
    return chars.filter((char) => {
        char = char.trim(); //除去首尾空格
        if (char !== '') {
            //不是全为空格
            if (stop.indexOf(char) === -1) {
                //不是停用词
                return true
            }
        }
        return false
    })
}
//分词
const cutChar = (sentence) => {
    let chars = []
    for (let char of sentence) {
        chars.push(char)
    }
    return removeStopChar(removeSign(chars))
}

//统计词频
const getEleNums = (data) => {
    let map = {}
    for (let i = 0; i < data.length; i++) {
        let key = data[i]
        if (map[key]) {
            map[key] += 1
        } else {
            map[key] = 1
        }
    }
    return map
}

//统计两本书的词频
const getCharsFrequency = (bookList1, bookList2) => {
    let text = ''
    bookList1.forEach((article) => {
        text += article.text
    })
    bookList2.forEach((article) => {
        text += article.text
    })
    let chars = cutChar(text)
    return [getEleNums(chars), chars.length]
}

//计算idf值
export const countIdf = (frequencyDic, documentLen) => {
    let resList = []
    documentLen /= 10
    for (let key in frequencyDic) {
        resList.push(
            {
                "word": key,
                "idf": Math.log(documentLen / frequencyDic[key]).toFixed(5)
            }
        )
    }
    return resList
}
//获取字和id的键值对，还有idf值表
export const getCharId = (bookList1, bookList2) => {
    let temp = getCharsFrequency(bookList1, bookList2)
    let wordAndIdf = countIdf(temp[0], temp[1])
    let charsId = {}
    wordAndIdf.forEach((dic, i) => {
        let key = dic.word
        charsId[key] = i
    })
    return {'idfList': wordAndIdf, 'charsMap': charsId}

}

export const readSentences = (bookList) => {
    let text = ''
    let sentences = []
    bookList.forEach((article) => {
        article.text.split('\n').forEach((p) => {
            p.split('。').forEach((s) => {
                sentences.push({'sentence': s, 'filename': article.filename})
            })
        })
    })

    let res = []
    sentences.forEach((sentence, i) => {
        res.push({'id': i, 'sentenceDic': sentence})
    })
    return res
}

//建立倒排索引 {字id:[句子id……]}
export const getInvertedIndex = (bookList, charsMap) => {
    let sentences = readSentences(bookList)//获取句子列表[{id,sentence}]
    let indexMap = {}//倒排索引表
    sentences.forEach((sentenceObj) => {
        let words = cutChar(sentenceObj.sentenceDic.sentence)
        words.forEach((char) => {
            let key = charsMap[char]
            if (indexMap[key]) {
                indexMap[key].push(sentenceObj.id)
            } else {
                indexMap[key] = [sentenceObj.id]
            }
        })
    })
    return {'indexMap': indexMap, 'sentences': sentences}
}


export const compareOne = (sentence, sentences2, indexMap, charTables, setting) => {
    let top = setting.top
    let threshold = setting.threshold
    let ignoreThreshold=setting.ignoreThreshold
    let words = cutChar(sentence)
    let comparedSentenceIds = []//比较文本的句子列表
    words.forEach((char) => {
        let ids = indexMap[charTables.charsMap[char]]
        if (typeof (ids) !== "undefined") {
            ids.forEach((num) => {
                comparedSentenceIds.push(num)
            })
        }
    })
    //统计句子id的出现频率
    let frequencyList = []
    let frequencyDic = getEleNums(comparedSentenceIds)
    for (let key in frequencyDic) {
        frequencyList.push({'id': key, 'count': frequencyDic[key]})
    }
    const compare = function (obj1, obj2) {
        let val1 = obj1.count;
        let val2 = obj2.count;
        if (val1 < val2) {
            return 1;
        } else if (val1 > val2) {
            return -1;
        } else {
            return 0;
        }
    }
    let sortedList = frequencyList.sort(compare)
    sortedList = sortedList.length > top ? sortedList.slice(0, top) : sortedList//取前top个
    //计算余弦相似度
    let compareRes = []
    sortedList.forEach((obj) => {
        let id = obj.id
        let compareSentence = sentences2[id].sentenceDic.sentence//比较的句子
        let compareChars = cutChar(compareSentence)
        let compareList1 = []
        let compareList2 = []
        words.forEach((char) => {
            let idf = charTables.idfList[charTables.charsMap[char]]
            compareList1.push({'char': char, 'idf': idf.idf})
        })
        compareChars.forEach((char) => {
            let idf = charTables.idfList[charTables.charsMap[char]]
            compareList2.push({'char': char, 'idf': idf.idf})
        })
        debugger
        let cos = computeCosSimilarForBookCompare(compareList1, compareList2, setting)
        if (ignoreThreshold||cos >= threshold) {
            compareRes.push({'sentence': compareSentence, 'sentenceId': id, 'cos': cos})
        }
    })
    return compareRes
}

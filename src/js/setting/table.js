const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择
const adapter = new FileSync('./DATAS/db.json'); // 申明一个适配器
const db = low(adapter);

export const readDB=(name)=>{
    let res=db.get(name).value()
    return res
}

export const deleteWord=(table,arg1,word)=>{
    let temp={}
    temp[arg1]=word
    db.get(table).remove(temp).write()
}

export const writeWord=(table,map)=>{
    db.get(table).push(map)
        .write()
}

export const writeStop=(textList)=>{
    db.get('stop')
        .assign(textList)
        .write()
}

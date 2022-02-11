const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择
const adapter = new FileSync('./DATAS/db.json'); // 申明一个适配器
const db = low(adapter);

//单个繁体转简体
export const charFanToJian=(char)=>{

    let res=db.get('simple').find({'fan':char}).value()
    if (typeof (res)!="undefined"){
        return res.jian
    }else{
        return char
    }
}

//单个异体转繁体
export const charYiToFan=(char)=>{
    let res=db.get('diff').find({'yi':char}).value()
    if (typeof (res)!="undefined"){
        return res.fan
    }else{
        return char
    }
}

//单个自定义转换B-》A
export const charCustom=(char)=>{
    let res=db.get('custom').find({'B':char}).value()
    if (typeof (res)!="undefined"){
        return res.A
    }else{
        return char
    }
}

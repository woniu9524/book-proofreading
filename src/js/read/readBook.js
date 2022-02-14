import axios from "axios";

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择
const adapter = new FileSync('./DATAS/bookIndex.json'); // 申明一个适配器
const db = low(adapter);
//读取文件
export const readBookFile = async (id) => {
    let bookInfo = db.get('index').find({'id': parseInt(id)}).value()
    let bookName = bookInfo.bookName
    let type = bookInfo.type
    let url = 'http://localhost:4000/findBook'
    let arg = {}
    await axios
        .get(url, {
            params: {
                'bookName': bookName,
            }
        })
        .then(function (response) {
            arg.context = response.data;
            arg.type = type
        }).catch(function (error) {
        console.log(error);
    });
    return arg
}




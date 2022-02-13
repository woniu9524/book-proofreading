const xlsx = require('node-xlsx');
export const readExcel=(filepath)=>{
    // 解析得到文档中的所有 sheet
    let sheets = xlsx.parse(filepath);
    // 遍历 sheet
    let resList=[]
    sheets.forEach(function(sheet){
        // 读取每行内容
        for(let rowId in sheet['data']){
            let row=sheet['data'][rowId];
            resList.push(row)
            console.log(1)
        }
    });
    return resList
}



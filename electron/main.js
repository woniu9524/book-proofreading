// electron/main.js

// 控制应用生命周期和创建原生浏览器窗口的模组

// const webApp =require ('../src/express/express.js')
const webApp = require(process.cwd() + '/express/express.js')
const {app, BrowserWindow} = require('electron')
const path = require('path')
const ipc = require('electron').ipcMain
const NODE_ENV = process.env.NODE_ENV

function createWindow() {
    // 创建浏览器窗口
    const mainWindow = new BrowserWindow({
        width: 1120,
        height: 680,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,//加上这个vue才能用require
            preload: path.join(__dirname, 'preload.js')
        }
    })


    // 加载 index.html
    mainWindow.loadURL(
        NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../dist/index.html')}`
    );

    // 打开开发工具
    if (NODE_ENV === "development") {
        mainWindow.webContents.openDevTools()
    }

}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

//打开预览窗口
ipc.on('openPreview', () => {
    let winA = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,//加上这个vue才能用require
            preload: path.join(__dirname, 'preload.js')
        }
    })
    let winURL = NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../dist/index.html')}`
    winA.loadURL(winURL + '#/preview');

    winA.on("close", function () {
        winA = null;
    })

})

//打开比较结果所在窗口
ipc.on('openViewText', () => {
    let winA = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,//加上这个vue才能用require
            preload: path.join(__dirname, 'preload.js')
        }
    })
    let winURL = NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../dist/index.html')}`
    winA.loadURL(winURL + '#/table/viewText');

    winA.on("close", function () {
        winA = null;
    })

})

ipc.on('openDictViewText', () => {
    let winA = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,//加上这个vue才能用require
            preload: path.join(__dirname, 'preload.js')
        }
    })
    let winURL = NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../dist/index.html')}`
    winA.loadURL(winURL + '#/dict/dictViewText');

    winA.on("close", function () {
        winA = null;
    })

})


//保存
const {dialog} = require('electron')
const fs = require("fs");
ipc.on('saveArticle', function (event, args) {
    dialog.showSaveDialog({
        title: '保存文件',
    }).then(result => {
        console.log(result.filePath)
        fs.writeFileSync(result.filePath + '.article', args)
    }).catch(err => {
        console.log(err)
    })
})

ipc.on('saveBook', function (event, args) {
    dialog.showSaveDialog({
        title: '保存文件',
    }).then(result => {
        console.log(result.filePath)
        fs.writeFileSync(result.filePath + '.book', args)
    }).catch(err => {
        console.log(err)
    })
})

ipc.on('saveExcel', function (event, args) {
    dialog.showSaveDialog({
        title: '保存文件',
    }).then(result => {
        let path = result.filePath
        if (path.length<=5||path.slice(path.length - 5, path.length) !== '.xlsx') {
            path += '.xlsx'
        }
        writeExcel(JSON.parse(args), path)
        event.reply("saveEnd");
    }).catch(err => {
        console.log(err)
    })

})

ipc.on('saveDictText', function (event,args) {
    dialog.showSaveDialog({
        title: '保存文件',
    }).then(result => {
        let path = result.filePath
        if (path.length<=4||path.slice(path.length - 4, path.length) !== '.txt') {
            path += '.txt'
        }
        fs.writeFileSync(result.filePath + '.txt', args)
        event.reply("saveEnd");
    }).catch(err => {
        console.log(err)
    })

})

const xlsx = require('node-xlsx');
const writeExcel = (data, filepath, header = ['文件名', '原文本', '文件名', '比较文本', '相似度']) => {
    let excelList = []
    excelList.push(header)
    data.forEach((lst) => {
        excelList.push(lst)
    })
    let bufferData = [{'name': '比较结果', 'data': excelList}]
    let buffer = xlsx.build(bufferData);

// 写入文件
    fs.writeFile(filepath, buffer, function (err) {
        if (err) {
            console.log("Write failed: " + err);
            return;
        }

    });

}

ipc.on('saveAll', function (event, args) {
    dialog.showSaveDialog({
        title: '保存文件',
    }).then(result => {
        let path = result.filePath
        if (path.slice(path.length - 5, path.length) !== '.compare') {
            path += '.compare'
        }
        fs.writeFileSync(path, args)
        event.reply("saveEnd");
    }).catch(err => {
        console.log(err)
    })

})

ipc.on('saveDictExcel', function (event, args) {
    dialog.showSaveDialog({
        title: '保存文件',
    }).then(result => {
        let path = result.filePath
        if (path.length<=5||path.slice(path.length - 5, path.length) !== '.xlsx') {
            path += '.xlsx'
        }
        writeDictExcel(JSON.parse(args), path)
        event.reply("saveDictEnd");
    }).catch(err => {
        console.log(err)
    })

})

const writeDictExcel = (data, filepath) => {


    let buffer = xlsx.build([{name: "字典", data: data[0]},{name: "频率", data: data[1]}]);
    // 写入文件
    fs.writeFile(filepath, buffer, function (err) {
        if (err) {
            console.log("Write failed: " + err);
            return;
        }
    });

}

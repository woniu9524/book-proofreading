// electron/main.js

// 控制应用生命周期和创建原生浏览器窗口的模组

// const webApp =require ('../src/express/express.js')
const webApp =require (process.cwd()+'/express/express.js')
const { app, BrowserWindow } = require('electron')
const path = require('path')
const ipc = require('electron').ipcMain
const NODE_ENV = process.env.NODE_ENV

function createWindow () {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1120,
    height: 680,
    webPreferences: {
      nodeIntegration:true,
      contextIsolation: false,//加上这个vue才能用require
      preload: path.join(__dirname, 'preload.js')
    }
  })


  // 加载 index.html
  mainWindow.loadURL(
    NODE_ENV === 'development'
      ? 'http://localhost:3000'
      :`file://${path.join(__dirname, '../dist/index.html')}`
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
ipc.on('openPreview',()=>
{
  let winA = new BrowserWindow ({
    width: 1000,
    height:800,
    webPreferences: {
      nodeIntegration:true,
      contextIsolation: false,//加上这个vue才能用require
      preload: path.join(__dirname, 'preload.js')
    }
  })
  let winURL=NODE_ENV === 'development'
      ? 'http://localhost:3000'
      :`file://${path.join(__dirname, '../dist/index.html')}`
  winA.loadURL(winURL+'#/preview');

  winA.on("close", function(){
    winA = null;
  })

})

//保存
const { dialog } = require('electron')
const fs = require("fs");
ipc.on('saveArticle',function (event, args) {
  dialog.showSaveDialog({
    title:'保存文件',
  }).then(result=>{
    console.log(result.filePath)
    fs.writeFileSync(result.filePath+'.article',args)
  }).catch(err=>{
    console.log(err)
  })
})

ipc.on('saveBook',function (event, args) {
  dialog.showSaveDialog({
    title:'保存文件',
  }).then(result=>{
    console.log(result.filePath)
    fs.writeFileSync(result.filePath+'.book',args)
  }).catch(err=>{
    console.log(err)
  })
})

ipc.on('saveExcel',function (event, args) {
  dialog.showSaveDialog({
    title:'保存文件',
  }).then(result=>{
    let path=result.filePath
    if(path.slice(path.length-5,path.length)!=='.xlsx'){
      path+='.xlsx'
    }
    writeExcel(JSON.parse(args),path)
    event.reply("saveEnd");
  }).catch(err=>{
    console.log(err)
  })

})
const xlsx = require('node-xlsx');
const writeExcel=(data,filepath,header=['文件名','原文本','文件名','比较文本','相似度'])=>{
  let excelList=[]
  excelList.push(header)
  data.forEach((lst)=>{
    excelList.push(lst)
  })
  let bufferData=[{'name':'比较结果','data':excelList}]
  let buffer = xlsx.build(bufferData);

// 写入文件
  fs.writeFile(filepath, buffer, function(err) {
    if (err) {
      console.log("Write failed: " + err);
      return;
    }

  });



}

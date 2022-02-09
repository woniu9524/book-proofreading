// electron/main.js

// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow } = require('electron')
const path = require('path')

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


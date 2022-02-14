const express=require('express');
const app =express();
const path=require('path');
const fs = require('fs');
const abspath = path.join(__dirname, "./public")
app.use(express.static(path.join(__dirname,'public')))
let cors=require("cors");

app.use(cors());

app.get('/',(req,res)=>{
    res.send(abspath)
});

app.get('/uploadBookImage',(req,res)=>{
    fs.copyFileSync(req.query.imagePath, abspath+'/bookCovers/'+req.query.imageName)
    res.send('完成')
})

app.get('/uploadBook',(req,res)=>{
    fs.copyFileSync(req.query.bookPath, abspath+'/books/'+req.query.bookName)
    res.send('完成')
})

app.listen(4000);
console.log("4000端口")

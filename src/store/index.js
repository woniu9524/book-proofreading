import { defineStore } from 'pinia' //从pinia中导入，defineStore方法，用于定义一个新的store
export const useProfileStore = defineStore('profile', { // 使用defineStore方法定义store
    state() { // state表示这个store里的状态，也就是存放数据的地方
        const config=readConfig()
        return {
            articles:[],
            splitSign:config['rank'].splitSign,
            rank:config['rank'],
            highlight:config['highlight']

        }
    },
    actions:{
        updateConfig(){
            //TODO 没有效果
            const config=readConfig()
            this.splitSign=config['rank'].splitSign
            this.rank=config['rank']
            this.highlight=config['highlight']
        }
    }
})


const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择

const adapter = new FileSync('./DATAS/config.json'); // 申明一个适配器
const db = low(adapter);

//读取配置信息
export const readConfig=()=>{
    let res={}
    res['rank']=db.read().get('rank').value()
    res['highlight']=db.read().get('highlight').value()
    return res
}

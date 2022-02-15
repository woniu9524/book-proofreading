<template>
    <div class="previewBackground ">
        <el-card class="textCard" shadow="always">
            <template #header>
                <div class="card-header">
                    <h1 style="font-family: 'Adobe 繁黑體 Std B'">{{title}}</h1>
                </div>
            </template>
            <p v-html="html" @click="getDiff"></p>
        </el-card>
    </div>
</template>

<script>
    import {ElNotification} from 'element-plus'
    import {defineComponent} from "@vue/runtime-core";

    export default defineComponent({
        name: "index",
        props: {
            html: {
                type:String,
                default:"",
            },
            diffTable: {
                type:Object,
                default:[],

            },
            title: {
                type:String,
                default:"",
            },
            tips: {
                type:String,
                default:"{原文} 在校对版本中作 {异文}",
            },
            keyword:{
                type:String,
                default:'',
            }

        },
        methods: {
            getDiff() {
                if (event.target.className === 'text-diff') {
                    let num = event.target.name;
                    console.log(num)
                    for (let obj of this.diffTable) {
                        if (obj.name === num) {
                            let msg = this.tips.replace('{原文}', '<span style="font-weight:bold">' + obj.origin + '</span>').replace('{异文}', '<span style="font-weight:bold">' + obj.compare + '</span>')
                            ElNotification({
                                title: '校对',
                                dangerouslyUseHTMLString: true,
                                message: msg,
                                type: 'success',
                            })
                        }
                    }
                }
            },

        },
    })
</script>

<style scoped>
    >>> .text-diff {
        color: #ef5b9c;
        text-decoration: none;
    }

    >>> .text-added {
        background-color: #60C25E;
        display: inline-block;
        color: #2F4858;
        padding-left: 3px;
        padding-right: 3px;
        border-radius: 5px;
        border: 1px solid #00AD77;
    }

    >>> .text-removed {
        background-color: #845EC2;
        display: inline-block;
        color: #F9F871;
        padding-left: 3px;
        padding-right: 3px;
        border-radius: 5px;
        border: 1px solid #D65DB1;


    }

    >>> .notice {
        color: #845EC2;
    }

    >>> .para-style {
        font-family: 方正楷体S-超大字符集;
        font-size: 20px;
    }

    .textCard {
        padding: 0px 64px;
        width: 70%;
        margin: 50px auto 0 auto;
        background-color: #FAF7ED;
    }

    .previewBackground {
        background-color: #ede8d5;
        background-size: 100% 100%;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        overflow-y: auto;

    }

    .card-header {
        display: flex;
        align-items: center;

    }

</style>

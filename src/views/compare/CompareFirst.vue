<template>

</template>

<script>

    import {getTextList} from '../../js/compare/splitArticles.js'
    import {rankSentence} from '../../js/compare/rankText.js'
    import {useProfileStore} from "../../store";
    import {storeToRefs} from 'pinia'
    export default {
        name: "CompareFirst",
        data(){
            return{
                splitSign:'',
            }
        },
        methods:{

        },
        mounted() {
            const profileStore = useProfileStore() // 获取到store的实例
            const {articles,splitSign}=storeToRefs(profileStore)
            let textLists= getTextList(articles.value[0].text,articles.value[1].text,splitSign.value)//得到分割后的文本
            let resList=rankSentence(textLists[0],textLists[1])
            console.log(resList)
        }
    }
</script>

<style scoped>

</style>
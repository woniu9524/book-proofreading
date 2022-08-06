<template>
    <div>

    </div>
</template>

<script>
    import {useProfileStore} from '../../../store'
    import {makeInvertedIndex} from '../../../js/dict/dictUtil.js'
    export default {
        name: "AllWordShow",
        data(){
            return{
                settingForm:{
                    splitInput: '',
                    filterInput: '',
                    minLength: 0,
                    removedInput: '',
                }
            }
        },
        methods:{

        },
        mounted(){
            const profileStore = useProfileStore() // 获取到store的实例
            this.settingForm=JSON.parse(this.$route.query.settingForm);
            console.log(profileStore.dictText)
            makeInvertedIndex(this.settingForm.removedInput,this.settingForm.splitInput,this.settingForm.filterInput,this.settingForm.minLength,profileStore.dictText[0].text);
        }
    }
</script>

<style scoped>

</style>

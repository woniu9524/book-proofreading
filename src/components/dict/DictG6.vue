<template>
  <div id="mountNode"></div>
</template>

<script>
import G6 from '@antv/g6';	//在需要的js文件引入
import {genGraphData, makeInvertedIndex} from '../../js/dict/dictUtil.js'
import {useProfileStore} from "../../store";
export default {
  name: "DictG6",
  props:{
    settingForm: {type: Object, required: true, default: {}},
  },
  data(){
    return{

    }
  },
  methods:{

  },
  mounted() {
    const profileStore = useProfileStore() // 获取到store的实例
    this.textDict = makeInvertedIndex(this.settingForm.removedInput, this.settingForm.splitInput, this.settingForm.filterInput, this.settingForm.minLength, profileStore.dictText[0].text);

    let graphData= genGraphData(this.textDict, 20, 50, 100)
    let graph = new G6.Graph({
      container: 'mountNode',
      width: window.innerWidth,
      height: window.innerHeight,
      modes: {
        default: ['drag-canvas', 'drag-node']
      },
      layout: {
        type: 'fruchterman',
        gravity: 1,
        speed: 5,
        preventOverlap: true,  // 防止节点重叠
      },
      animate: true,
      defaultNode: {
        size: [20, 20],
        color: 'steelblue',
        style: {
          lineWidth: 2,
          fill: '#fff'
        }
      },
      defaultEdge: {
        size: 1,
        color: '#e2e2e2',
        style: {
          endArrow: {
            path: 'M 4,0 L -4,-4 L -4,4 Z',
            d: 4
          }
        }
      }
    });
    graph.data(graphData);
    graph.render();

    graph.on('click', (ev)=>{
      let model=ev.item.getModel();
      console.log(model)
    });
  }
}
</script>

<style scoped>

</style>

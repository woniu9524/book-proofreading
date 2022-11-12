<template>
  <div id="mountNode"></div>
</template>

<script>
import G6 from '@antv/g6';	//在需要的js文件引入

export default {
  name: "MultiG6",
  props:{
    graphData:{type: Object, required: true, default: {}},
  },
  data(){
    return{

    }
  },
  methods:{

  },
  mounted() {
    console.log(this.graphData)
    let graph = new G6.Graph({
      container: 'mountNode',
      width: 900,
      height: window.innerHeight,
      modes: {
        default: ['drag-canvas', 'drag-node']
      },
      layout: {
        type: 'fruchterman',
        gravity:3,
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

    graph.data(this.graphData);
    graph.render();

    // graph.on('click', (ev)=>{
    //   let model=ev.item.getModel();
    //   console.log(model)
    // });
  }
}
</script>

<style scoped>

</style>

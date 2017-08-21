<template>
  <div class="world">
    <h1 ref="world">这是world的dom元素</h1>
    <button @click='send'>给父元素传递dom</button>
    <div id="main"></div>
  </div>
</template>
<scripttype="text/ecmascript-6">
import echarts from 'echarts';
var myChart = echarts.init(document.getElementById('main'));
// 绘制图表
myChart.setOption({
    title: { text: 'ECharts 入门示例' },
    tooltip: {},
    xAxis: {
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
    }]
});
export default {
  methods: {
    send(){
      this.$emit('give',this.$refs.world); //给父元素发送dom
      console.log(this.$refs.world);
    }
  }
}
</script>
<style>

</style>

<template>
  <div id="app">
    <!--<hello></hello>-->
    <!--<h1>{{setmsg}}</h1>-->
  </div>
</template>
<script>
// import hello from './components/Hello'
import Vue from 'vue'
import axios from 'axios'
const vue3 = {
  name: 'app',
  data(){
    return {
      a: 1,
      b: [2,4,6],
      propnum: null,
      d:{name:'hcc',age: 25},
      e: 'hcc',
      msg: ''
    }
  },
  created(){
    console.log(this)
  },
  methods: {
    getData() {
      axios.get('http://rap.taobao.org/mockjsdata/24170/category/topList').then(res => {
        this.propnum = res;
      })
    }
  },
  components: {
    // hello
  },
  asyncComputed: {
    type() {
      return  axios.get('http://rap.taobao.org/mockjsdata/24170/category/topList').then(res => res.data.lists)
    }
  }
}
export default vue3
</script>

<style scoped>
</style>

<!--
 * @Author: maxizhang
 * @Date: 2020-05-05 14:41:07
 * @FilePath: /practice/vue/hello-world/src/App.vue
 * @Description: 
-->
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <div @click="handleClick">dinwo</div>
    <div v-for="(obj, index) in t" key="index">
      {{obj.a}}
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  // components: {
  //   HelloWorld
  // },
  data: function() {
return { a: 1, t: [] };
},
  mounted() {
    this.t = [
      {a:1},
      {a:2}
    ]
  },
  computed: {
    // 仅读取
    aDouble: function () {
      return this.a * 2
    },
    // 读取和设置
    aPlus: {
      get: function () {
        return this.a + 1
      },
      set: function (v) {
        this.a = v - 1
      }
    }
  },
  methods: {
    handleClick(){
      this.t[0].a +=1
      this.t[1] = {a:3} 
      this.t[2] = {a:3} 
      console.log('1111')
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

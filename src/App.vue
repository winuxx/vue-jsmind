<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <div id="header">
    <h1>Vue JSMind</h1>
    <!-- <p>Author:Qian |:kk4201@126.com</p> -->
  </div>
  <Mind msg="" />
</template>

<script>
import Mind from './components/Mind.vue'

export default {
  name: 'App',
  components: {
    Mind,
  }
}

</script>

<style>
html {
  background: #d6ebfd;
  height: 100%;
}
body {
  height: calc(100% - 60px);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  height: 100%;
}
#header {
  /* height:4rem; */
  /* z-index: 100; */
}
#header > h1 {
  /* margin-bottom: 0.1em; */
}
#header > p {
  /* margin-top: 0.1em; */
}
</style>

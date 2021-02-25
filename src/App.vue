<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <div id="header">
    <h1>Vue JSMind</h1>
    <p>Qian | <a href="mailto://kk4201@126.com">kk4201@126.com</a></p>
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
  height: calc(100% - 3rem);
}
a {
  text-decoration: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
#header {
  height:3rem;
  line-height: 1.5rem;
  /* margin-bottom: 0.5em; */
}
#header > h1 {
  margin-bottom: 0;
}
#header > p {
  margin-top: 0;
  font-size: 0.8em;
}
</style>

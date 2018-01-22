<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'mysterion'
  }
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Ubuntu');

  $win-width: 500px;
  $win-height: 500px;

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Ubuntu', sans-serif;
    background: url('~@/assets/bg.png') no-repeat -50px -50px;
    width: $win-width;
    height: $win-height;
    -ms-overflow-style: scrollbar;
    -webkit-app-region: drag;
  }

  #app {
    width:100%;
    height:100%;
  }
  /* CSS */
</style>

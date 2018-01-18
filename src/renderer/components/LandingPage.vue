<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="mysterium">
    <main>
    </main>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'

  export default {
    name: 'landing-page',
  }
</script>


<style>

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
  }

  main {
    display: flex;
    justify-content: space-around;
  }

</style>

<template>
  <div>
    <button class="alt" @click="connect()">Connect</button><br/>
    <div class="title">Status</div>
    <div class="value">{{ error }}</div>
    <div class="value">{{ status }}</div>
  </div>
</template>

<script>
  const remote = require('electron').remote
  const spawn = require('child_process').spawn
  export default {
    data () {
      return {
        status: 'waiting for user',
        error: ''
      }
    },
    methods: {
      connect () {
        this.status = 'connecting'
        let mystProcess = spawn(remote.getGlobal('__mysteriumClientBin'), ['--node', 'andy']) // dev env
        mystProcess.stdout.on('data', (data) => {
          this.status += data
        })
        mystProcess.stderr.on('data', (data) => {
          this.error += data
        })
        mystProcess.on('close', (code) => {
          this.status += 'myst process exited'
        })
      }
    }

  }
</script>

<style lang="scss" scoped>
  .title {
    color: #888;
    font-size: 18px;
    font-weight: initial;
    letter-spacing: .25px;
    margin-top: 10px;
  }
  
  button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

</style>

<template>
  <div>
    <div class="title">Status</div>
    <div class="items">
      <div class="item">
        <button class="alt" @click="connect()">Connect</button><br/>
        <div class="value">{{ status }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  const remote = require('electron').remote
  const exec = require('child_process').exec
  export default {
    data () {
      return {
        status: 'waiting for user'
      }
    },
    methods: {
      connect () {
        this.status = 'connecting'
        exec(remote.getGlobal('__mysteriumClientBin'), // dev env
          (error, stdout, stderr) => {
            this.status = stdout
            console.log(`stdout: ${stdout}`)
            console.log(`stderr: ${stderr}`)
            if (error !== null) {
              console.log(`exec error: ${error}`)
            }
          })
      },
      open (link) {
        this.$electron.shell.openExternal(link)
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

  .items { margin-top: 8px; }

  .item {
    margin-bottom: 6px;
    .name {
      color: #6a6a6a;
      margin-right: 6px;
    }
    .value {
      color: #35495e;
      font-weight: bold;
    }
  }

</style>

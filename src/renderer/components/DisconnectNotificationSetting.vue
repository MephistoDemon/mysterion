<template>
  <div class="round-checkbox">
    <label class="outer" for="checkbox">Notify on disconnect</label>
    <input type="checkbox" id="checkbox" v-model="isDisconnectNotificationEnabled" />
    <label class="inner" for="checkbox" @click="toggle" ></label>
  </div>
</template>

<script>
  export default {
    name: 'DisconnectNotificationSetting',
    dependencies: ['rendererCommunication'],
    data () {
      return {
        isDisconnectNotificationEnabled: true
      }
    },
    mounted () {
      this.rendererCommunication.onUserSettings((settings) => {
        this.isDisconnectNotificationEnabled = settings.showDisconnectNotifications
      })
      this.rendererCommunication.requestUserSettings()
    },
    methods: {
      toggle () {
        this.isDisconnectNotificationEnabled = !this.isDisconnectNotificationEnabled
        this.rendererCommunication.sendUserSettingsUpdate({
          showDisconnectNotifications: this.isDisconnectNotificationEnabled
        })
      }
    }
  }
</script>

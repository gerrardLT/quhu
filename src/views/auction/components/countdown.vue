<template>
  <div>
    <p v-if="expired">已过期</p>
    <p v-else>{{ formatTime(countdown) }}</p>
  </div>
</template>

<script>
export default {
  props: {
    endTime: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      countdown: 0,
      expired: false
    }
  },
  mounted() {
    this.startCountdown()
  },
  methods: {
    startCountdown() {
      setInterval(() => {
        const currentTime = Math.floor(Date.now() / 1000)
        if (currentTime > this.endTime) {
          this.expired = true
        } else {
          const diff = Math.floor((this.endTime - currentTime) / 1000)
          if (diff > 0) {
            this.countdown = diff
          } else {
            this.expired = true
          }
        }
      }, 1000)
    },
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = seconds % 60
      return `${this.formatNumber(hours)}:${this.formatNumber(
        minutes
      )}:${this.formatNumber(remainingSeconds)}`
    },
    formatNumber(num) {
      return num.toString().padStart(2, '0')
    }
  }
}
</script>

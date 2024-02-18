<template>
    <div class="wrapper">
      
    </div>
</template>

<script>
export default {
  name: 'Treasure',
  props: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {
    init() {
      $('.chest-close').click(function () {
        $(this).addClass('shake')
        var that = this
        this.addEventListener(
          'webkitAnimationEnd',
          function () {
            $(that).closest('.open-has').addClass('opened')
            setTimeout(function () {
              $(that).removeClass('show')
              $(that).closest('.mod-chest').find('.chest-open').addClass('show')
              setTimeout(function () {
                $('.chest-open').addClass('blur')
              }, 500)
            }, 200)
          },
          false
        )
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>

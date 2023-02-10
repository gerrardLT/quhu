<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-23 03:51:01
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-23 04:58:29
 * @FilePath: \quhu\src\components\Icon\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <svg :style="{fill:color?color:'',width:'20px',height:'30px'}">
    <use :xlink:href="'#icon-'+name" rel="external nofollow" />
  </svg>
</template>

<script>
export default {
  props: {
    name: String,
    color: {
      // 图标颜色
      type: String,
      deafult: '#5D5D5D'
    }
  }
}
</script>

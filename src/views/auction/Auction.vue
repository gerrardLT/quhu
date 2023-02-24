<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-12 14:01:22
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-30 03:26:24
 * @FilePath: \quhu\src\views\Home.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div class="Auction_container">

    </div>
  </div>
</template>

<script>
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'Auction',
  created() {},
  mounted() {},
  data() {
    return {}
  },
  methods: {
    post() {
      // postUrl = $STM_Config.upload_image + '/' + username + '/' + sig;
      // sig = _ecc.Signature.signBufferSha256(bufSha, d).toHex();
      // d = stateUser.getIn(['current', 'private_keys', 'posting_private']);
      // bufSha = _ecc.hash.sha256(buf);
      // prefix = new Buffer('ImageSigningChallenge');
      // buf = Buffer.concat([prefix, data]);
      // data = _context12.sent;//上传回调数据
    }
  }
}
</script>

<style scoped lang="scss">
</style>




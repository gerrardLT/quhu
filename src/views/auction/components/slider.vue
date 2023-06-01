<template>
  <div class="slider_container">
    <el-carousel height="300px">
      <el-carousel-item v-for="item in advertisementList" :key="item.title">
        <router-link
          :to="{
            path: '/auctiondetail',
            query: {
              author: item.permlink[0],
              permlink: item.permlink[1]
            }
          }"
        >
          <img
            class="advertise_image"
            style="width: 100%; object-fit: cover"
            :src="item.image"
            alt=""
        /></router-link>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: 'slider',
  data() {
    return {
      advertisementList: [
        {
          author: '卖鱼的',
          steem_id: 'q4742fbc1',
          permlink: ['onlyfun-data88', 'onlyfun-sdfg4ni8bo'],
          title: '拍卖测试1',
          start_time: 1684290326,
          end_time: 1684859882000,
          starting_price: 1000,
          new_price: 1000.0,
          coins: 'poys',
          increase: 100,
          image: require('../../../assets/nft/debris_gold.jpg'),
          type: 'bid_onlyfun',
          avatar:
            'https://cdn.steemitimages.com/DQmWqz5wH3mki4JGksF2q5XEfM32iAQbLJGWYm45rTrZoFo/t%E5%A4%B4%E5%83%8F2.jpg'
        },
        {
          author: '卖鱼的',
          steem_id: 'q4742fbc11111',
          permlink: ['onlyfun-data88', 'onlyfun-sdfg4ni8bo'],
          title: '拍卖测试2',
          start_time: 1684290326,
          end_time: 1684860000000,
          starting_price: 1000,
          new_price: 1000.0,
          coins: 'poys',
          increase: 100,
          image: require('../../../assets/nft/debris_gold.jpg'),
          type: 'bid_onlyfun'
        },
        {
          author: '卖鱼的',
          steem_id: 'q4742fbc1222',
          permlink: ['onlyfun-data88', 'onlyfun-sdfg4ni8bo'],
          title: '拍卖测试3',
          start_time: 1684290326,
          end_time: 1684802382184,
          starting_price: 1000,
          new_price: 1000.0,
          coins: 'poys',
          increase: 100,
          image: require('../../../assets/nft/debris_gold.jpg'),
          type: 'bid_onlyfun'
        },
        {
          author: '卖鱼的',
          steem_id: 'q4742fbc1222222',
          permlink: ['onlyfun-data88', 'onlyfun-sdfg4ni8bo'],
          title: '拍卖测试4',
          start_time: 1684290326,
          end_time: 1684802382184,
          starting_price: 1000,
          new_price: 1000.0,
          coins: 'poys',
          increase: 100,
          image: require('../../../assets/nft/debris_gold.jpg'),
          type: 'bid_onlyfun'
        },
        {
          author: '卖鱼的',
          steem_id: 'q4742fbc1222222222',
          permlink: ['onlyfun-data88', 'onlyfun-sdfg4ni8bo'],
          title: '拍卖测试5',
          start_time: 1684290326,
          end_time: Date.now() + 1000 * 60 * 60 * 8,
          starting_price: 1000,
          new_price: 1000.0,
          coins: 'poys',
          increase: 100,
          image: require('../../../assets/nft/debris_gold.jpg'),
          type: 'bid_onlyfun'
        }
      ]
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.slider_container {
  margin-bottom: 20px;
}
.advertise_image {
  width: 100%;
}
</style>

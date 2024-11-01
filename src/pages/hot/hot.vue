// /src/pages/hot/hot.vue
<script setup lang="ts">
import { getHotRecommendAPI } from '@/services/hot'
import type { HotResult, SubTypeItem } from '@/types/hot'

// 热门推荐页 标题和url
const hotMap = [
  { type: '1', title: '特惠推荐', url: '/hot/preference' },
  { type: '2', title: '爆款推荐', url: '/hot/inVogue' },
  { type: '3', title: '一站买全', url: '/hot/oneStop' },
  { type: '4', title: '新鲜好物', url: '/hot/new' },
]

const query = defineProps<{
  type: string
}>()

const currHot = hotMap.find((item) => item.type === query.type)

//动态设置标题
uni.setNavigationBarTitle({
  title: currHot!.title,
})

const hotResult = ref<HotResult>()
// subTypes 的数据结构
// { id, title, goodsItems: [] }[]
// goodItem 的数据结构
// { items: [], counts, page, pageSize, pages }
const subTypes = ref<(SubTypeItem & { finish?: boolean })[]>([])
const activeIndex = ref(0)

const getHotRecommendData = async () => {
  const res = await getHotRecommendAPI(currHot!.url, {
    page: import.meta.env.DEV ? 30 : 1,
    pageSize: 10,
  })
  const result = res.result
  hotResult.value = result
  subTypes.value = result.subTypes
}

// 页面加载
// onLoad 也可以
onMounted(() => {
  getHotRecommendData()
})

// 滚动
const onScrollTolower = async () => {
  const currentSubType = subTypes.value[activeIndex.value]
  const currentSubTypeId = currentSubType.id
  // 当前页面累加
  const prevPage = currentSubType.goodsItems.page
  const total = currentSubType.goodsItems.pages
  let page = prevPage

  // 分页条件
  if (prevPage < total) {
    // 当前页码累加
    page = ++currentSubType.goodsItems.page
  } else {
    // 标记已结束
    currentSubType.finish = true
    // 退出并轻提示
    return uni.showToast({ icon: 'none', title: '没有更多数据了~' })
  }
  // 调用 api 传参
  const res = await getHotRecommendAPI(currHot!.url, {
    subType: currentSubTypeId,
    page,
    pageSize: currentSubType.goodsItems.pageSize,
  })
  const result = res.result
  const newSubTypes = result.subTypes
  const goodsItems = newSubTypes[activeIndex.value].goodsItems
  currentSubType.goodsItems.items.push(...goodsItems.items)
}
</script>

<template>
  <view class="viewport">
    <!-- 推荐封面图 -->
    <view class="cover">
      <image :src="hotResult?.bannerPicture"></image>
    </view>
    <!-- 推荐选项 -->
    <view class="tabs">
      <text
        class="text"
        :class="{ active: index === activeIndex }"
        v-for="(tab, index) in subTypes"
        :key="tab.id"
        @tap="activeIndex = index"
        >{{ tab.title }}</text
      >
    </view>
    <!-- 推荐列表 -->
    <scroll-view
      v-for="(item, index) in subTypes"
      v-show="index === activeIndex"
      :key="item.id"
      scroll-y
      class="scroll-view"
      @scrolltolower="onScrollTolower"
    >
      <view class="goods">
        <navigator
          hover-class="none"
          class="navigator"
          v-for="good in item.goodsItems?.items"
          :key="good.id"
          :url="`/pages/goods/goods?id=${good.id}`"
        >
          <image class="thumb" :src="good.picture"></image>
          <view class="name ellipsis">{{ good.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ good.price }}</text>
          </view>
        </navigator>
      </view>
      <view class="loading-text" v-if="!item.finish">正在加载...</view>
    </scroll-view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  background-color: #f4f4f4;
}
.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 180rpx 0 0;
  position: relative;
}
.cover {
  width: 750rpx;
  height: 225rpx;
  border-radius: 0 0 40rpx 40rpx;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
}
.scroll-view {
  flex: 1;
}
.tabs {
  display: flex;
  justify-content: space-evenly;
  height: 100rpx;
  line-height: 90rpx;
  margin: 0 20rpx;
  font-size: 28rpx;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
  color: #333;
  background-color: #fff;
  position: relative;
  z-index: 9;
  .text {
    margin: 0 20rpx;
    position: relative;
  }
  .active {
    &::after {
      content: '';
      width: 40rpx;
      height: 4rpx;
      transform: translate(-50%);
      background-color: #27ba9b;
      position: absolute;
      left: 50%;
      bottom: 24rpx;
    }
  }
}
.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx 20rpx;
  .navigator {
    width: 345rpx;
    padding: 20rpx;
    margin-top: 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }
  .thumb {
    width: 305rpx;
    height: 305rpx;
  }
  .name {
    height: 88rpx;
    font-size: 26rpx;
  }
  .price {
    line-height: 1;
    color: #cf4444;
    font-size: 30rpx;
  }
  .symbol {
    font-size: 70%;
  }
  .decimal {
    font-size: 70%;
  }
}

.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0 50rpx;
}
</style>

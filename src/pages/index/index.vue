<script setup lang="ts">
import { getHomeBannerAPI } from '@/services/home'
import CustomNavbar from './components/CustomNavbar.vue'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import type { BannerItem } from '@/types/home'

const bannerList = ref<BannerItem[]>([])
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  console.log('res', res)
  bannerList.value = res.result
}

onLoad(() => {
  getHomeBannerData()
})
</script>

<template>
  <!-- 解决这个报错需要安装 Vue - Official v2.0.12 版本即可 -->
  <view class="index">
    <CustomNavbar />
    <XtxSwiper :list="bannerList" />
  </view>
</template>

<style lang="scss">
//
</style>

<script lang="ts">
import localMKData from '../../data/localMKData'
import homePage from '../../pageModel/homePage'

export default {
  data() {
    return {
      // 是否屏蔽顶部轮播图
      isDelHomeTopCarouselV: localMKData.isDelHomeTopCarouselGm(),
      //是否屏蔽公告板
      isDelHomeNoticeBoardV: localMKData.isDelHomeNoticeBoardGm(),
    }
  },
  watch: {
    isDelHomeTopCarouselV(newVal) {
      GM_setValue('is_del_home_top_carousel_gm', newVal)
      if (homePage.isUrlPage()) {
        homePage.shieldHomeTopCarousel();
      }
    },
    isDelHomeNoticeBoardV(n) {
      GM_setValue('is_del_home_notice_board_gm', n)
      if (homePage.isUrlPage()) {
        homePage.shieldHomeNoticeBoard();
      }
    }
  }
}
</script>

<template>
  <div>
    <el-switch v-model="isDelHomeTopCarouselV" active-text="屏蔽顶部轮播图"/>
    <el-switch v-model="isDelHomeNoticeBoardV" active-text="屏蔽公告板"/>
  </div>
</template>
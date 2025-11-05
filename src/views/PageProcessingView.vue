<script lang="ts">
import HomePageProcessingView from './pageProcessing/HomePageProcessingView.vue'
import localMKData from './../data/localMKData'
import postPage from '../pageModel/postPage'
import GeneralPageProcessingView from "./pageProcessing/GeneralPageProcessingView.vue";

export default {
  components: {GeneralPageProcessingView, HomePageProcessingView},
  data() {
    return {
      //是否屏蔽右侧我要反馈按钮
      isDelPostFeedbackButtonV: localMKData.isDelPostFeedbackButtonGm(),
    }
  },
  watch: {
    isDelPostFeedbackButtonV(n) {
      GM_setValue('is_del_post_feedback_button_gm', n)
      postPage.shieldRightFeedbackButton();
    }
  }
}
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>常规</template>
      <GeneralPageProcessingView/>
    </el-card>
    <el-card shadow="never">
      <template #header>首页</template>
      <HomePageProcessingView/>
    </el-card>
    <el-card shadow="never">
      <template #header>帖子页</template>
      <el-switch v-model="isDelPostFeedbackButtonV" active-text="屏蔽右侧我要反馈按钮"/>
    </el-card>
  </div>
</template>
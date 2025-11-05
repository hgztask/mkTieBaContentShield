<script lang="ts">
import localMKData from '../../data/localMKData'
import pageCommon from '../../pageModel/pageCommon'
//常规页面处理组件
export default {
  data() {
    return {
      //是否屏蔽下载客户端提示
      isDelDownloadClientTipV: localMKData.isDelDownloadClientTipGm(),
      //是否屏蔽辅助模式按钮
      isDelAssistantModeButtonV: localMKData.isDelAssistantModeButtonGm(),
      //是否屏蔽右侧分享按钮
      isDelShareButtonV: localMKData.isDelShareButtonGm(),
    }
  },
  watch: {
    isDelDownloadClientTipV: function (n) {
      GM_setValue('is_del_download_client_tip_gm', n)
      pageCommon.shieldDownloadClientTip();
    },
    isDelAssistantModeButtonV(n) {
      GM_setValue('is_del_assistant_mode_button_gm', n)
      pageCommon.shieldAssistantModeBut();
    },
    isDelShareButtonV(n) {
      GM_setValue('is_del_share_button_gm', n)
      pageCommon.shieldRightShareBut();
    }
  }
}
</script>
<template>
  <div>
    <el-switch v-model="isDelDownloadClientTipV" active-text="屏蔽下载客户端提示"/>
    <el-switch v-model="isDelAssistantModeButtonV" active-text="屏蔽辅助模式按钮"/>
    <el-switch v-model="isDelShareButtonV" active-text="屏蔽右侧分享按钮"/>
  </div>
</template>
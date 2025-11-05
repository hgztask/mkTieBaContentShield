<script lang="ts">
import {eventEmitter} from "./model/EventEmitter";
import PanelSettingsView from "./views/PanelSettingsView.vue";
import SheetDialog from './eventEmitter_components/SheetDialog.vue'
import RuleManagementView from "./views/RuleManagementView.vue";
import OutputInformationView from "./views/OutputInformationView.vue";
import AboutAndFeedbackView from "./views/AboutAndFeedbackView.vue";
import DonateLayoutView from "./views/DonateLayoutView.vue";
import RuleExportImportView from "./views/RuleExportImportView.vue";
import PageProcessingView from "./views/PageProcessingView.vue";

/**
 * Drawer 的内容是懒渲染的，即在第一次被打开之前，传入的默认 slot 不会被渲染到 DOM 上。
 */
export default {
  components: {
    RuleManagementView, PanelSettingsView, SheetDialog, OutputInformationView, AboutAndFeedbackView,
    DonateLayoutView, RuleExportImportView, PageProcessingView
  },
  data() {
    return {
      drawer: false
    }
  },
  methods: {},
  created() {
    eventEmitter.on('主面板开关', () => {
      this.drawer = !this.drawer;
    })
    document.addEventListener('keydown', (event) => {
      eventEmitter.emit('event-keydownEvent', event);
      if (event.key === '`') {
        this.drawer = !this.drawer;
      }
    });
    eventEmitter.on('el-notify', (options: any) => {
      if (!options['position']) {
        options.position = 'bottom-right';
      }
      this.$notify(options)
    })
    eventEmitter.on('el-msg', (...options: any) => {
      this.$message.apply(this, options)
    })
    eventEmitter.on('el-alert', (...options: any) => {
      this.$alert.apply(this, options);
    })
    eventEmitter.handler('el-confirm', (...options: any) => {
      return this.$confirm.apply(this, options)
    })
    eventEmitter.handler('el-prompt', (...options: any) => {
      return this.$prompt.apply(this, options)
    })
  }
}
</script>

<template>
  <div>
    <el-drawer :modal="false" :visible.sync="drawer"
               :z-index="10006"
               direction="rtl" size="40%"
               style="position: fixed"
               title="贴吧内容屏蔽器">
      <el-tabs tab-position="left" type="card">
        <el-tab-pane label="规则管理">
          <RuleManagementView/>
        </el-tab-pane>
        <el-tab-pane label="导出导入" lazy>
          <RuleExportImportView/>
        </el-tab-pane>
        <el-tab-pane label="页面处理" lazy>
          <PageProcessingView/>
        </el-tab-pane>
        <el-tab-pane label="输出信息">
          <OutputInformationView/>
        </el-tab-pane>
        <el-tab-pane label="面板设置" lazy>
          <PanelSettingsView/>
        </el-tab-pane>
        <el-tab-pane label="关于反馈" lazy>
          <AboutAndFeedbackView/>
          <DonateLayoutView/>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
    <SheetDialog/>
  </div>
</template>

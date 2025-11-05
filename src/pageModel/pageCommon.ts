import localMKData from "../data/localMKData";
import elUtil from "../utils/elUtil";

export default {
    //屏蔽下载客户端提示
    shieldDownloadClientTip() {
        if (!localMKData.isDelDownloadClientTipGm()) return
        //css对应首页下载客户端提示和帖子页右侧下载客户端按钮
        elUtil.installStyle(`.app_download_box,.tbui_aside_fbar_button.tbui_fbar_down{
          display: none;
     }`, '#shield_home_download_client_tip')
    },
    shieldRightShareBut() {
        if (!localMKData.isDelShareButtonGm()) return
        // css对应首页分享按钮和帖子页分享按钮
        elUtil.installStyle(`#spage-tbshare-container,.tbui_aside_fbar_button.tbui_fbar_share{
         display: none;
        }`, '#shield_home_share_button')
    },
    //屏蔽辅助模式按钮
    shieldAssistantModeBut() {
        if (!localMKData.isDelAssistantModeButtonGm()) return
        elUtil.installStyle(`.tbui_aside_float_bar>.tbui_fbar_auxiliaryCare{
         display: none;
        }
        `, '#shield_home_assistant_mode_button')
    }
}
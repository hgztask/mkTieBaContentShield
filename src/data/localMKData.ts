import ruleKVDataList from '../res/ruleKVDataList.json'

//获取选项
const selectOptions = [
    {
        value: '模糊匹配',
        label: '模糊匹配',
        children: [] as any[]
    },
    {
        value: '正则匹配',
        label: '正则匹配',
        children: [] as any[]
    },
    {
        value: '精确匹配',
        label: '精确匹配',
        children: [] as any[]
    }
]
for (const {name, key, pattern} of ruleKVDataList) {
    switch (pattern) {
        case '模糊':
            selectOptions[0].children.push({value: key, label: name, pattern})
            break;
        case '正则':
            selectOptions[1].children.push({value: key, label: name, pattern})
            break;
        case '精确':
            selectOptions[2].children.push({value: key, label: name, pattern});
            break;
        case '关联':
            selectOptions[3].children.push({value: key, label: name, pattern});
            break;
    }
}


export default {
    selectOptions,
    //获取抽屉快捷键
    getDrawerShortcutKeyGm() {
        return GM_getValue('drawer_shortcut_key_gm', '`')
    },
    // 是否删除首页轮播
    isDelHomeTopCarouselGm() {
        return GM_getValue('is_del_home_top_carousel_gm', false)
    },
    isDelHomeNoticeBoardGm() {
        return GM_getValue('is_del_home_notice_board_gm', false)
    },
    isDelDownloadClientTipGm() {
        return GM_getValue('is_del_download_client_tip_gm', false)
    },
    isDelAssistantModeButtonGm() {
        return GM_getValue('is_del_assistant_mode_button_gm', false)
    },
    isDelShareButtonGm() {
        return GM_getValue('is_del_share_button_gm', false)
    },
    isDelPostFeedbackButtonGm() {
        return GM_getValue('is_del_post_feedback_button_gm', false)
    }
}



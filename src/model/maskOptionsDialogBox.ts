import {eventEmitter} from "./EventEmitter";
import ruleUtil from "../utils/ruleUtil";

eventEmitter.on('event:mask_options_dialog_box', (data: PostDataType) => {
    const {userLongStrId, userName, barName, postId} = data;
    const showList = []
    if (userLongStrId) {
        showList.push({label: `用户长串id精确屏蔽=${userLongStrId}`, value: 'userLongId_precise'})
    }
    if (userName) {
        showList.push({label: `用户名精确屏蔽=${userName}`, value: 'username_precise'});
    }
    if (barName) {
        showList.push({label: `吧名精确屏蔽=${barName}`, value: 'barName_precise'})
    }
    if (postId) {
        showList.push({label: `帖子id精确屏蔽=${postId}`, value: 'postId_precise'})
    }
    eventEmitter.send('sheet-dialog', {
        title: "屏蔽选项",
        list: showList,
        optionsClick: (item: { label: string, value: string }) => {
            const {value} = item
            let results
            if (value === 'userLongId_precise') {
                results = ruleUtil.addRule(userLongStrId!, value);
            } else if (value === 'username_precise') {
                results = ruleUtil.addRule(userName!, value);
            } else if (value === 'barName_precise') {
                results = ruleUtil.addRule(barName!, value);
            } else if (value === 'postId_precise') {
                results = ruleUtil.addRule(postId, value);
            } else {
                eventEmitter.send('el-msg', "出现意外的选项值");
                return
            }
            if (results) {
                eventEmitter.emit('el-msg', results.res)
                    .emit('event:刷新规则信息', false)
                    .emit('event:通知屏蔽')
            }
        }
    })
})

import {returnTempVal} from "../data/globalValue";
import {eventEmitter} from "../model/EventEmitter";
import shielding from "./shielding";

/**
 * 屏蔽单个评论项
 * @param commentsData
 * @returns {Object}
 * @property {boolean} state 是否屏蔽
 * @property {string} type 屏蔽的类型
 * @property {string} matching 匹配到的规则`
 */
const shieldingComment = (commentsData: CommentDataType): DefReturnTempValType => {
    const {content, userLongStrId, userName} = commentsData;
    let testV;
    if (userLongStrId) {
        testV = shielding.blockUserId(userLongStrId);
        if (testV.state) return testV;
    }
    if (userName) {
        testV = shielding.blockUserName(userName);
        if (testV.state) return testV;
    }
    if (content) {
        testV = shielding.blockExactAndFuzzyMatching(content, {
            fuzzyKey: 'comment',
            fuzzyTypeName: '模糊评论内容',
            regexKey: 'comment_regex',
            regexTypeName: '正则评论内容'
        })
        if (testV.state) return testV;
    }
    return returnTempVal;
}

//评论项屏蔽模块
export default {
    /**
     * 遍历评论列表数据，屏蔽评论项
     * @param commentsData {CommentDataType[]}
     */
    shieldingComments(commentsData: CommentDataType[]) {
        for (let commentsDatum of commentsData) {
            const {state, type, matching} = shieldingComment(commentsDatum);
            const {el, replyList, content} = commentsDatum;
            if (state) {
                el.remove()
                eventEmitter.send('event:print-msg', `${type}规则【${matching}】屏蔽评论【${content}】`)
                continue;
            }
            eventEmitter.emit('event:插入屏蔽按钮', commentsDatum);
            if (replyList === undefined) continue;
            for (const replyListElement of replyList) {
                const testResults = shieldingComment(replyListElement);
                const {state, type, matching} = testResults;
                if (state) {
                    const {el, content} = replyListElement;
                    el.remove()
                    eventEmitter.send('event:print-msg', `${type}规则【${matching}】屏蔽评论【${content}】`)
                    continue;
                }
                eventEmitter.emit('event:插入屏蔽按钮', replyListElement);
            }
        }
    }
}
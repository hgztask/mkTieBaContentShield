import elUtil from '../utils/elUtil'
import ruleMatchingUtil from '../utils/ruleMatchingUtil'
import {eventEmitter} from '../model/EventEmitter'
import shielding from "../shieldingModel/shielding";
import urlUtil from "../utils/urlUtil";
//获取热议榜
const getHotList = async () => {
    const els = await elUtil.findElements('.topic_list>.topic_item')
    const list: { title: string, heat: number, el: Element }[] = []
    for (const el of els) {
        const titleEl = el.querySelector('.topic_name')!;
        const title = titleEl.textContent.trim();
        const heatEl = el.querySelector('.topic_num')!;
        const heatStr = heatEl.textContent.trim();
        const heat = parseInt(heatStr);
        list.push({title, heat, el});
    }
    return list;
}

//获取帖子列表数据
const getPostDataList = async () => {
    const els = await elUtil.findElements('li.thread-item')
    const list: PostDataType[] = []
    for (const el of els) {
        const barNameEl = el.querySelector('a.forum-name') as HTMLAreaElement;
        const postTitleEl = el.querySelector('a.title') as HTMLAreaElement;
        const previewContentEl = el.querySelector('.content');
        const userNameAEl = el.querySelector('.author-info>a') as HTMLAreaElement;
        const barName = barNameEl.textContent.trim();
        const postTitle = postTitleEl.textContent.trim();
        const postUrl = barNameEl.href;
        const postId = urlUtil.parsePostUrlId(postUrl)
        let previewContent = '';
        if (previewContentEl) {
            previewContent = previewContentEl.textContent.trim()
        }
        const userName = userNameAEl.textContent.trim();
        list.push({
            barName, postTitle, postUrl, previewContent, userName, el, postId
            , insertionPositionEl: userNameAEl.parentElement!
        });
    }
    return list;
}

/**
 * 贴吧热议页
 * todo 后续补充右侧的相关吧推荐和下方的最新参与吧友列表的添加屏蔽按钮操作
 */
export default {
    //是否是贴吧热议页面
    isThisPage(url: string) {
        return url.includes('//tieba.baidu.com/hottopic/browse/hottopic')
    },
    //检查热议榜
    checkHotList() {
        getHotList().then(list => {
            const hotWordList: string[] = GM_getValue('hotWord', []);
            const hotWord_regexList: string[] = GM_getValue('hotWord_regex', []);
            for (let item of list) {
                const {title, el} = item;
                let testV = ruleMatchingUtil.fuzzyMatch(hotWordList, title);
                if (testV) {
                    el.remove();
                    console.log();
                    eventEmitter.send('event:print-msg', `根据模糊匹配${testV}屏蔽了热议榜【${title}】`)
                    continue;
                }
                testV = ruleMatchingUtil.regexMatch(hotWord_regexList, title);
                if (testV) {

                    el.remove();
                    eventEmitter.send('event:print-msg', `根据正则匹配${testV}屏蔽了热议榜【${title}】`)
                }
            }
        });
    },
    //检查帖子列表
    checkPostList() {
        getPostDataList().then(list => {
            shielding.shieldingItemDecorated(list);
        })
    }
}
import elUtil from "../utils/elUtil";
import urlUtil from "../utils/urlUtil";
import shielding from "../shieldingModel/shielding";

/**
 * 获取吧的吧主推荐列表
 * todo 这里用户名预览显示的标题过长时会被截取省略并且部分情况会出现预览的用户名和实际的用户名不一致的情况，对不上data-field属性值中的用户名
 */
const getDataList = async () => {
    const els = await elUtil.findElements('#thread_list>li.thread_item_box')
    const list: PostDataType[] = []
    for (const el of els) {
        const titleAEl = el.querySelector('a.j_th_tit') as HTMLAreaElement;
        const userEl = el.querySelector('.tb_icon_author') as HTMLSpanElement;
        //这里获取的用户名过长时会被截取省略
        const userAEl: HTMLAreaElement = el.querySelector('.tb_icon_author a.frs-author-name')!;
        const previewContentEl = el.querySelector('.threadlist_text>div') as HTMLAreaElement;
        const previewContent = previewContentEl.textContent.trim();
        const postTitle = titleAEl.textContent.trim();
        const postUrl = titleAEl.href;
        const postId = urlUtil.parsePostUrlId(postUrl);
        const userElTitle = userEl.getAttribute('title') as string;
        const userATxt = userAEl.textContent;
        let userName;
        /*
        当显示的内容显示的末尾是省略号时，则优先使用标题中的用户名
        如标题中的用户名开头部分和显示的用户名开头部分相同时，则使用标题中的用户名，反之，不赋值，留空
        如果显示的内容末尾不是省略号，则使用显示的用户名
         */
        if (userATxt.endsWith('...')) {
            const localName = userElTitle.match('作者:(.*)')![1].trim();
            if (localName[0] === userATxt[0]) {
                userName = localName
            }
        } else {
            userName = userATxt;
        }
        const userLongStrId = urlUtil.parseUserUrlId(userAEl.href);
        list.push({
            insertionPositionEl: userAEl.parentElement!, postId,
            postUrl, previewContent, userLongStrId, userName, el, postTitle
        })
    }
    return list;
}

//吧的首页
export default {
    //是否是吧的首页
    isThisPage(url: string) {
        const b = url.includes('tieba.baidu.com/f?kw=');
        if (b) {
            const parseUrl = urlUtil.parseUrl(url);
            const tab = parseUrl.queryParams.tab;
            if (tab === 'album' || tab === 'video') {
                return false;
            }
        }
        return b
    },
    //检查吧的吧主推荐列表
    checkBarRecommendList() {
        getDataList().then(list => {
            shielding.shieldingItemDecorated(list);
        })
    }
}
import elUtil from "../utils/elUtil";
import urlUtil from "../utils/urlUtil";
import shielding from "../shieldingModel/shielding";

const getDataList = async () => {
    const els = await elUtil.findElements('.s_post_list>.s_post')
    const list: PostDataType[] = []
    for (const el of els) {
        const titleAel = el.querySelector('.p_title>a') as HTMLAreaElement;
        const previewContentEl = el.querySelector('.p_content')!;
        const barNameEl = el.querySelector('.p_forum') as HTMLAreaElement;
        const userAEl = el.querySelector('a[href^="/home/main?id="]') as HTMLAreaElement;
        const postTitle = titleAel.textContent.trim();
        const postUrl = titleAel.href;
        const postId = urlUtil.parsePostUrlId(postUrl);
        const previewContent = previewContentEl.textContent.trim();
        const barName = barNameEl.textContent.trim();
        const barUrl = barNameEl.href;
        const userName = userAEl.textContent.trim();
        const userUrl = userAEl.href;
        const userLongStrId = urlUtil.parseUserUrlId(userUrl);
        list.push({
            postUrl, insertionPositionEl: el, barName, barUrl, postTitle, previewContent, postId,
            userName, userUrl, userLongStrId, el
        });
    }
    return list;
}

//搜索页·通过全吧搜索按钮跳转
export default {
    isThisPage(url: string): boolean {
        return url.includes('//tieba.baidu.com/f/search/res');
    },
    checkSearchContentList() {
        getDataList().then(list => {
            shielding.shieldingItemDecorated(list);
        })
    }
}
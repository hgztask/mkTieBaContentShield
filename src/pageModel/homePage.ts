import elUtil from "../utils/elUtil";
import urlUtil from "../utils/urlUtil";
import shielding from "../shieldingModel/shielding";
import localMKData from "../data/localMKData";

const getDataList = async () => {
    const els = await elUtil.findElements('#new_list>li')
    const list: PostDataType[] = []
    for (const el of els) {
        if (el.childElementCount === 0) continue;
        const barNameAEl: HTMLAreaElement = el.querySelector('.n_name.feed-forum-link')!;
        const barTitleEl: HTMLAreaElement = el.querySelector('.title.feed-item-link')!;
        const previewContentEl = el.querySelector('.n_txt')!;
        const userAEl: HTMLAreaElement = el.querySelector('.post_author')!;
        const barName = barNameAEl.getAttribute('title')!;
        const barUrl = barNameAEl.href!;
        const postTitle = barTitleEl.textContent.trim();
        const postUrl = barTitleEl.href!;
        // 帖子预览内容
        const previewContent = previewContentEl.textContent.trim();
        const userName = userAEl.textContent.trim();
        const userUrl = userAEl.href;
        const userLongStrId = urlUtil.parseUrl(userUrl).queryParams.id;
        const postId = urlUtil.parsePostUrlId(postUrl)
        list.push({
            insertionPositionEl: barTitleEl, postId,
            barName, userLongStrId, barUrl, postTitle, postUrl, previewContent, userName, userUrl, el
        });
    }
    return list;
}

//贴吧首页模块
export default {
    //是否是贴吧首页
    isUrlPage(url: string = location.href, title: string = document.title) {
        return url === 'https://tieba.baidu.com/' && title.trim() === '百度贴吧——全球领先的中文社区';
    },
    //检查首页动态列表
    checkHomeDynamicList() {
        getDataList().then(list => {
            shielding.shieldingItemDecorated(list);
        });
    },
    //屏蔽首页顶部轮播图
    shieldHomeTopCarousel() {
        if (!localMKData.isDelHomeTopCarouselGm()) return

        elUtil.installStyle(`.top-sec.clearfix{
          display: none;
   }`, '#shield_home_top_carousel')
    },
    //屏蔽首页公告栏
    shieldHomeNoticeBoard() {
        if (!localMKData.isDelHomeNoticeBoardGm()) return
        elUtil.installStyle(`#notice_item{
          display: none;
   }`, '#shield_home_notice_board')
    }
}
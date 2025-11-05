import './menu'
import './data/globalValue'
import "./layout_init";
import './model/maskOptionsDialogBox'
import './model/notificationBlocking'
import watch from './watch/watch'
import urlUtil from "./utils/urlUtil";
import homePage from "./pageModel/homePage";
import hotDiscussionPage from "./pageModel/hotDiscussionPage";
import postPage from "./pageModel/postPage";

window.parseUrl = urlUtil.parseUrl;
window.addEventListener('load', () => {
    console.log('页面加载完成');
})

watch.addEventListenerNetwork((url) => {
    if (url.includes('//tieba.baidu.com/f/index/feedlist')) {
        // 首页动态列表
        homePage.checkHomeDynamicList();
    }
    if (url.includes('//tieba.baidu.com/hottopic/browse/getTopicRelateThread?topic_name=')) {
        hotDiscussionPage.checkPostList();
    }
    if (url.includes('//tieba.baidu.com/p/comment?tid=')) {
        console.log('评论数据加载了');
        postPage.checkPostCommentList();
    }
})

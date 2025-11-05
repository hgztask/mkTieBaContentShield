import {eventEmitter} from "./model/EventEmitter";
import postBarClassPage from "./pageModel/postBarClassPage";
import homePage from "./pageModel/homePage";
import pageCommon from './pageModel/pageCommon'
import postPage from "./pageModel/postPage";
import hotDiscussionPage from "./pageModel/hotDiscussionPage";
import userHomePage from "./pageModel/UserHomePage";

export default {
    /**
     * 静态路由
     * @param title {string} 标题
     * @param url {string} url地址
     */
    staticRoute(title: string, url: string) {
        console.log("静态路由", title, url)
        eventEmitter.send('event:通知屏蔽');
        if (postBarClassPage.isThisPage(url)) {
            postBarClassPage.insertShieldingButton();
        }
        if (homePage.isUrlPage(url, title)) {
            homePage.shieldHomeTopCarousel();
            homePage.shieldHomeNoticeBoard();
        }
        if (postPage.isUrlPage(url)) {
            postPage.shieldRightFeedbackButton();
            hotDiscussionPage.checkHotList();
            postPage.insertAddShieldingButton();
        }
        if (hotDiscussionPage.isThisPage(url)) {
            hotDiscussionPage.checkHotList();
        }
        if (userHomePage.isThisPage(url)) {
            userHomePage.insertAddShieldingButton();
        }
        pageCommon.shieldDownloadClientTip();
        pageCommon.shieldRightShareBut();
        pageCommon.shieldAssistantModeBut();
    },
    /**
     * 动态路由
     * @param title {string} 标题
     * @param url {string} url地址
     */
    dynamicRouting(title: string, url: string) {
        console.log("动态路由", title, url);
        eventEmitter.send('event:通知屏蔽');
        if (postBarClassPage.isThisPage(url)) {
            postBarClassPage.insertShieldingButton();
        }
    }
}

import {eventEmitter} from "./EventEmitter";
import homePage from "../pageModel/homePage";
import postPage from "../pageModel/postPage";
import barHomePage from "../pageModel/barHomePage";
import searchPage from "../pageModel/searchPage";
import hotDiscussionPage from "../pageModel/hotDiscussionPage";

eventEmitter.on('event:通知屏蔽', () => {
    const url = location.href;
    const title = document.title;
    if (homePage.isUrlPage(url, title)) {
        homePage.checkHomeDynamicList();
    }
    if (postPage.isUrlPage(url)) {
        postPage.checkPostCommentList();
    }
    if (barHomePage.isThisPage(url)) {
        barHomePage.checkBarRecommendList();
    }
    if (searchPage.isThisPage(url)) {
        searchPage.checkSearchContentList();
    }
    if (hotDiscussionPage.isThisPage(url)) {
        hotDiscussionPage.checkPostList();
        hotDiscussionPage.checkHotList();
    }
});
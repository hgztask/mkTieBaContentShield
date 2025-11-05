// src/shims-vue.d.ts

declare const __DEV__: boolean;

declare module '*.vue' {
    export default Vue;
}

declare module "*.css" {
    const content: string;
    export default content;
}

interface Window {
    mk_win: Window,
    parseUrl,
    addButton
}

interface DefReturnTempValType {
    state: boolean,
    type?: string,
    matching?: string | number
}

// 通用数据类型
type BasicDataType = {
    //用户名
    userName?: string,
    //用户长串id
    userLongStrId?: string,
    //用户链接
    userUrl?: string,
    el: Element,
    insertionPositionEl: Element,
    explicitSubjectEl?: Element,
}


//帖子数据类型
interface PostDataType extends BasicDataType {
    //吧名
    barName?: string,
    //吧名链接
    barUrl?: string,
    //帖子标题
    postTitle: string,
    //帖子链接
    postUrl: string,
    postId: number,
    //帖子预览内容
    previewContent: string
}

//评论数据类型
interface CommentDataType extends BasicDataType {
    content: string,
    replyList?: CommentDataType[]
}

//贴吧分类数据类型
interface BarClassDataType {
    el: Element,
    //吧名
    barName: string,
    //吧名链接
    barUrl: string,
    insertionPositionEl: Element,
    explicitSubjectEl?: Element
}

interface DefReturnTempValType {
    state: boolean,
    type?: string,
    matching?: string | number
}

type  ruleKeyDataListItemType = {
    name: string,
    key: string,
    pattern: string,
    fullName: string,
    len?: number,
}

type outputInfoType = {
    msg: string,
    data: any,
    showTime?: string
}
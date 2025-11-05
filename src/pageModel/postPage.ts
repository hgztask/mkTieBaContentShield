import elUtil from "../utils/elUtil";
import comments_shielding from "../shieldingModel/comments_shielding";
import localMKData from "../data/localMKData";
import {eventEmitter} from "../model/EventEmitter";
import urlUtil from "../utils/urlUtil";
import ruleUtil from "../utils/ruleUtil";

//获取楼中楼评论列表
const getMidFloorList = async (el: Element) => {
    const replyList: CommentDataType[] = [];
    const replyEls: NodeListOf<HTMLLIElement> = el.querySelectorAll('.core_reply_wrapper ul>li')
    for (const replyEl of replyEls) {
        if (replyEl.classList.contains('lzl_li_pager_s')) {
            continue;
        }
        const contentEl = replyEl.querySelector('.lzl_content_main')!;
        const replyDataFieldStr = replyEl.getAttribute('data-field');
        const insertionPositionEl = replyEl.querySelector('.lzl_content_reply')!;
        const userAEl = replyEl.querySelector('a[href^="/home/main?id"]')!;
        if (replyDataFieldStr === null) {
            console.error(el, replyEl);
            throw new Error('楼层中的data-field属性为空');
        }
        // 楼层数据，需留意，如果成员，有昵称，应该是先显示则user_nickname字段否则为user_name字段
        const replyDataField = JSON.parse(replyDataFieldStr.replaceAll('\'', '"'));
        const {portrait} = replyDataField;
        const userLongStrId = portrait;
        const userName = userAEl.textContent.trim();
        const content = contentEl.textContent.trim();
        replyList.push({userName, userLongStrId, el: replyEl, content, insertionPositionEl})
    }
    return replyList;
}

/**
 * 等待楼中层加载队列
 * 循环等待，直到楼层中的.core_reply_wrapper .loading_reply节点不存在才开始获取楼层数据进行检查屏蔽
 * @param el
 */
const waitForCommentListLoadedQueue = async (el: Element) => {
    await new Promise((resolve) => {
        const i = setInterval(() => {
            if (el.querySelector('.core_reply_wrapper .loading_reply') === null) {
                clearInterval(i);
                resolve(null);
            }
        }, 1000)
    });
    const replyList = await getMidFloorList(el);
    comments_shielding.shieldingComments(replyList);
}

/**
 * 需要注意的是el中的data-field属性值dataField.authorauthor中有个user_name字段和user_nickname字段
 * 两个字段是不相同的值，待后续观察确认，有时user_nickname为null，实际显示的又不是user_name字段的值
 * 猜测显示的为user_nickname实际的字段
 *
 * todo dataField.content.content;该评论字段如果有表情包的话，会包括表情包的html代码,后续需处理
 *
 * 注意该.core_reply_wrapper .loading_reply对应的节点存在时表明该楼层回复列表还未加载完成
 */
const getDataList = async () => {
    const els = await elUtil.findElements('#j_p_postlist>.l_post')
    const list: CommentDataType[] = []
    for (const el of els) {
        const dataFieldStr = el.getAttribute('data-field');
        if (dataFieldStr === null) {
            throw new Error('data-field属性为空');
        }
        const userAEl: HTMLAreaElement = el.querySelector('a.p_author_name')!
        const contentEl = el.querySelector('.d_post_content')!;
        const dataField = JSON.parse(dataFieldStr);
        const author = dataField.author!;
        const {user_id: userLongStrId} = author;
        const userName = userAEl.textContent.trim();
        const content = contentEl.textContent.trim();
        let replyList: CommentDataType[] = []
        if (el.querySelector('.core_reply_wrapper .loading_reply')) {
            waitForCommentListLoadedQueue(el);
        } else {
            replyList = await getMidFloorList(el);
        }
        list.push({
            userName, userLongStrId, content, el, replyList,
            insertionPositionEl: el.querySelector('.d_author')!
        });
    }
    return list;
}

//帖子页
export default {
    //是否是帖子页
    isUrlPage(url: string) {
        return url.includes('//tieba.baidu.com/p/');
    },
    //检查帖子评论列表
    checkPostCommentList() {
        getDataList().then(list => {
            comments_shielding.shieldingComments(list);
        });
    },
    //屏蔽右侧我要反馈按钮
    shieldRightFeedbackButton() {
        if (!localMKData.isDelPostFeedbackButtonGm()) return;
        elUtil.installStyle(`.tbui_aside_fbar_button.tbui_fbar_feedback{
         display: none;
        }
        `, '#shield_post_feedback_button')
    },
    insertAddShieldingButton() {
        elUtil.findElement('#j_core_title_wrap').then(el => {
            const but = document.createElement('button');
            but.textContent = '屏蔽';
            but.setAttribute('gz_type', '')
            el?.appendChild(but);
            but.addEventListener('click', () => {
                const postId = urlUtil.parsePostUrlId(location.href);
                const titleEl = document.querySelector('#j_core_title_wrap>.core_title_txt')!;
                const title = titleEl.textContent.trim();
                eventEmitter.invoke('el-confirm', `屏蔽帖子${title}吗？id=${postId}`, '添加精确帖子id').then(() => {
                    ruleUtil.addRulePrecisePostId(postId)
                })
            })
        })
    }
}
import urlUtil from "../utils/urlUtil";
import elUtil from "../utils/elUtil";
import {eventEmitter} from "../model/EventEmitter";
//获取用户主页信息
const getUserInfo = async () => {
    const userNameEl = await elUtil.findElement('.userinfo_username') as HTMLSpanElement;
    const {un, id} = urlUtil.parseUrl(location.href).queryParams as { un: string, id: string };
    const dataObj: { userLongStrId?: string, userName?: string } = {}
    if (id) {
        dataObj.userLongStrId = id
    }
    if (un) {
        dataObj.userName = un;
    } else {
        dataObj.userName = userNameEl.textContent.trim();
    }
    return dataObj
}

//用户主页
export default {
    isThisPage(url: string) {
        return url.includes('//tieba.baidu.com/home/main')
    },
    //插入添加屏蔽按钮
    insertAddShieldingButton() {
        elUtil.findElement('.interaction_wrap.interaction_wrap_theme1').then((el) => {
            const but = document.createElement('button');
            but.textContent = '添加屏蔽';
            but.setAttribute('gz_type', '')
            el?.appendChild(but);
            but.addEventListener('click', async () => {
                const userInfo = await getUserInfo();
                eventEmitter.emit('event:mask_options_dialog_box', userInfo)
            })
        })
    }
}
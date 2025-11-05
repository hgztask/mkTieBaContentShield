import elUtil from "../utils/elUtil";
import {eventEmitter} from "../model/EventEmitter";

const getDataList = async () => {
    const els = await elUtil.findElements('#ba_list>.ba_info')
    const list: BarClassDataType[] = [];
    for (const el of els) {
        const barUrlAEl = el.querySelector('a.ba_href') as HTMLAreaElement;
        const barNameEl = el.querySelector('.ba_name')!;
        const barName = barNameEl.textContent.trim();
        const barUrl = barUrlAEl.href;
        list.push({
            barName, barUrl, el, insertionPositionEl: barNameEl
        });
    }
    return list;
}

//贴吧分类页面
export default {
    isThisPage(url: string): boolean {
        return url.includes('//tieba.baidu.com/f/index/forumpark');
    },
    //插入屏蔽按钮
    insertShieldingButton() {
        getDataList().then(items => {
            for (const item of items) {
                eventEmitter.emit('event:插入屏蔽按钮', item);
            }
        });
    }
}
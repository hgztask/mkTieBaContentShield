import {returnTempVal} from "../data/globalValue";
import {eventEmitter} from "../model/EventEmitter";
import ruleMatchingUtil from "../utils/ruleMatchingUtil";

type blockExactAndFuzzyMatchingType = {
    //精确匹配规则在存储中的键名
    exactKey?: string,
    //精确匹配类型的显示名称
    exactTypeName?: string,
    //精确匹配规则数组（可选，若未提供则通过exactKey从存储获取）
    exactRuleArr?: string[] | number[],
    //模糊匹配规则在存储中的键名
    fuzzyKey?: string,
    //模糊匹配类型的显示名称
    fuzzyTypeName?: string,
    //模糊匹配规则数组（可选，若未提供则通过fuzzyKey从存储获取）
    fuzzyRuleArr?: string[],
    //正则匹配规则在存储中的键名
    regexKey?: string,
    //正则匹配类型的显示名称
    regexTypeName?: string,
    //正则匹配规则数组（可选，若未提供则通过regexKey从存储获取）
    regexRuleArr?: string[]
}

/**
 * 执行精确、模糊和正则匹配的通用屏蔽检查函数
 * 根据提供的配置项依次执行三种类型的匹配检查，优先级为：精确 > 模糊 > 正则
 * @param val {string} 待匹配的字符串值
 * @param config {blockExactAndFuzzyMatchingType} 配置项对象
 * @returns {DefReturnTempValType}
 *          匹配成功返回包含状态、匹配类型和匹配值的对象；
 *          无匹配时返回returnTempVal（预定义的默认返回值对象）
 */
const blockExactAndFuzzyMatching = (val: string, config: blockExactAndFuzzyMatchingType): DefReturnTempValType => {
    if (!val) return returnTempVal
    const {
        exactKey, exactTypeName, fuzzyKey, fuzzyTypeName,
        regexKey, regexTypeName
    } = config;
    let matching;
    if (exactKey) {
        if (ruleMatchingUtil.exactMatch(GM_getValue(exactKey, []), val)) {
            return {state: true, type: exactTypeName, matching: val}
        }
    }
    if (fuzzyKey) {
        matching = ruleMatchingUtil.fuzzyMatch(GM_getValue(fuzzyKey, []), val);
        if (matching) {
            return {state: true, type: fuzzyTypeName, matching}
        }
    }
    if (regexKey) {
        matching = ruleMatchingUtil.regexMatch(GM_getValue(regexKey, []), val);
        if (matching) {
            return {state: true, type: regexTypeName, matching}
        }
    }
    return returnTempVal
}

eventEmitter.on('event:插入屏蔽按钮', (itemData: PostDataType) => {
    const {insertionPositionEl, el} = itemData;
    let but: HTMLButtonElement | null = insertionPositionEl.querySelector('button[gz_type]');
    if (but !== null) return;
    but = document.createElement('button')
    but.setAttribute('gz_type', '');
    but.textContent = '屏蔽';
    but.addEventListener('click', (event) => {
        event.stopImmediatePropagation(); // 阻止事件冒泡和同一元素上的其他事件处理器
        event.preventDefault(); // 阻止默认行为
        if (__DEV__) {
            console.log('点击了屏蔽按钮', itemData);
        }
        eventEmitter.emit('event:mask_options_dialog_box', itemData)
    })
    insertionPositionEl.appendChild(but);
    //当没有显隐主体元素，则主动隐藏，不添加鼠标经过显示移开隐藏事件
    let explicitSubjectEl = itemData?.explicitSubjectEl;
    if (explicitSubjectEl === undefined) {
        explicitSubjectEl = el;
    }
    if (insertionPositionEl) {
        but.style.display = "none";
        explicitSubjectEl.addEventListener("mouseout", () => but.style.display = "none");
        explicitSubjectEl.addEventListener("mouseover", () => but.style.display = "");
    }
});
//根据吧名检查屏蔽
const blockBarName = (name: string) => {
    return blockExactAndFuzzyMatching(name, {
        exactKey: 'barName_precise', exactTypeName: '精确吧名', fuzzyKey: 'barName', fuzzyTypeName: '模糊吧名',
        regexKey: 'barName_regex', regexTypeName: '正则吧名'
    })
}
//根据帖子标题检查屏蔽
const blockPostTitle = (title: string) => {
    return blockExactAndFuzzyMatching(title, {
        fuzzyKey: 'postTitle', fuzzyTypeName: '模糊帖子标题',
        regexKey: 'postTitle_regex', regexTypeName: '正则帖子标题'
    })
}
//根据预览内容检查屏蔽
const blockPreviewContent = (content: string) => {
    return blockExactAndFuzzyMatching(content, {
        fuzzyKey: 'postPreviewContent', fuzzyTypeName: '模糊预览内容',
        regexKey: 'postPreviewContent_regex', regexTypeName: '正则预览内容'
    })
}

//根据帖子id检查屏蔽
const blockPostId = (id: number) => {
    if (ruleMatchingUtil.exactMatch(GM_getValue('postId_precise', []), id)) {
        return {state: true, type: '精确帖子id', matching: id};
    }
    return returnTempVal;
}

export default {
    blockExactAndFuzzyMatching,
    //根据用户名检查屏蔽
    blockUserName(name: string) {
        return blockExactAndFuzzyMatching(name, {
            exactKey: 'username_precise',
            exactTypeName: '精确用户名',
            fuzzyKey: 'username',
            fuzzyTypeName: '模糊用户名',
            regexKey: 'username_regex',
            regexTypeName: '正则用户名'
        })
    },
    //根据用户id检查屏蔽
    blockUserId(id: string) {
        if (ruleMatchingUtil.exactMatch(GM_getValue('userLongId_precise', []), id)) {
            return {state: true, type: '精确用户长串id', matching: id};
        }
        return returnTempVal;
    },
    shieldingItem(itemData: PostDataType): DefReturnTempValType {
        const {
            userName, userLongStrId, barName, postTitle, previewContent,
            postId
        } = itemData;
        let testV;
        if (userLongStrId) {
            testV = this.blockUserId(userLongStrId);
            if (testV.state) return testV;
        }
        if (userName) {
            testV = this.blockUserName(userName);
            if (testV.state) return testV;
        }
        if (barName) {
            testV = blockBarName(barName);
            if (testV.state) return testV;
        }
        if (postTitle) {
            testV = blockPostTitle(postTitle);
            if (testV.state) return testV;
        }
        if (previewContent) {
            testV = blockPreviewContent(previewContent);
            if (testV.state) return testV;
        }
        testV = blockPostId(postId);
        if (testV.state) return testV;
        return returnTempVal
    },
    shieldingItemDecorated(list: PostDataType[]) {
        for (const itemData of list) {
            const testResults = this.shieldingItem(itemData)
            const {state, type, matching} = testResults;
            if (state) {
                const {el, userName} = itemData;
                el.remove();
                const {postTitle} = itemData;
                eventEmitter.send('event:print-msg', `${type}规则【${matching}】屏蔽用户${userName}的帖子${postTitle}`)
                continue;
            }
            eventEmitter.emit('event:插入屏蔽按钮', itemData);
        }
    }
}
unsafeWindow.mk_win = window;

window.addButton = (el: Element, doNotInsert = false) => {
    const butEl = document.createElement('button');
    butEl.textContent = '屏蔽';
    butEl.setAttribute('gz_type', '')
    if (doNotInsert) return butEl;
    el.appendChild(butEl);
}
export const returnTempVal: DefReturnTempValType = {state: false};

export default {
    //加群链接_qq
    group_url: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=tFU0xLt1uO5u5CXI2ktQRLh_XGAHBl7C&authKey=KAf4rICQYjfYUi66WelJAGhYtbJLILVWumOm%2BO9nM5fNaaVuF9Iiw3dJoPsVRUak&noverify=0&group_code=876295632',
    //作者B站链接
    b_url: 'https://space.bilibili.com/473239155',
    //todo 后续更换为实际的脚本猫更新地址
    scriptCat_js_url: 'https://scriptcat.org/zh-CN/users/96219',
    //todo 后续更换为greasyfork的实际地址
    greasyfork_js_url: 'https://greasyfork.org/zh-CN/scripts/461382',
    github_url: 'https://github.com/hgztask/mkTieBaContentShield',
    update_log_url: 'https://docs.qq.com/doc/DSnhjSVZmRkpCd0Nj'
}

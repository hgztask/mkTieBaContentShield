import defUtil from "./utils/defUtil";
import App from "./App.vue";
import elUtil from "./utils/elUtil";
import router from "./router";
import watch from "./watch/watch";
import defaultStyle from "./css/def.css";
import gzStyle from "./css/gz-style.css";

window.addEventListener('DOMContentLoaded', () => {
    console.log('页面元素加载完成');
    if (document.head.querySelector('#element-ui-css') === null) {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://unpkg.com/element-ui@2.15.14/lib/theme-chalk/index.css'
        linkElement.id = 'element-ui-css'
        document.head.appendChild(linkElement)
        linkElement.addEventListener('load', () => {
            console.log('element-ui样式加载完成')
        })
    }
    const {vueDiv} = elUtil.createVueDiv(document.body);
    defUtil.initVueApp(vueDiv, App);
    router.staticRoute(document.title, window.location.href);
    watch.addEventListenerUrlChange((newUrl: string, oldUrl: string, title: string) => {
        router.dynamicRouting(title, newUrl);
    })
    GM_addStyle(defaultStyle)
    GM_addStyle(gzStyle)
    elUtil.updateCssVModal();
})

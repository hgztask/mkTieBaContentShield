export default {
    /**
     * 解析 URL
     * @param urlString 要解析的 URL 字符串
     */
    parseUrl(urlString: string) {
        // 创建一个新的 URL 对象
        const url = new URL(urlString);
        // 提取路径部分并分割成数组
        const pathSegments = url.pathname.split('/').filter(segment => segment !== '');
        // 使用 URLSearchParams 来解析查询参数
        const searchParams = new URLSearchParams(url.search.slice(1));
        const queryParams: Record<string, string> = {};
        for (const [key, value] of searchParams.entries()) {
            queryParams[key] = value;
        }
        return {
            protocol: url.protocol,
            hostname: url.hostname,
            port: url.port,
            pathname: url.pathname,
            pathSegments,
            search: url.search,
            queryParams,
            hash: url.hash
        };
    },
    /**
     * 解析用户 URL 中的 ID
     * @param url 用户 URL
     */
    parseUserUrlId(url: string) {
        const urlObj = this.parseUrl(url);
        return urlObj.queryParams.id;
    },
    // 解析帖子 URL 中的帖子ID
    parsePostUrlId(url: string) {
        if (!url.includes('//tieba.baidu.com/p/')) return -1;
        const urlObj = this.parseUrl(url);
        return parseInt(urlObj.pathSegments[1]);
    },
}
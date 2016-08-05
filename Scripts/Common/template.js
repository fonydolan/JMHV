define(['underscore'], function (_) {
    var templateC = {
        cache: {},
        dataTempl: function () {
            this.dom = null; //放置解析后html的dom对象
            this.datas = null; //数据,和模板中定义的格式一致{  }
            this.url = null; //模板文件地址
            //模板标记模块 例：TemplTableRow 
            //那么模板页中就是<TemplTableRow></TemplTableRow>之间的内容
            this.uniqueID = null;
            this.callback = function () { }; //回调函数
            return this;
        },
        load: function (data) {
            if (data && data.url && data.url.length > 0) {
                var content = templateC.getCache(data.url);
                if (content) {
                    templateC.render(data, content);
                }
                else {
                    templateC.loadTemplate(data, content);
                }
            }
        },
        loadTemplate: function (data) {
            var xhr = $.ajaxSettings.xhr();
            xhr.open("GET", data.url, true);
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    templateC.setCache(data.url, xhr.responseText);
                    templateC.render(data, xhr.responseText);
                }
            }
        },
        setCache: function (key, value) {
            var cache = this.cache;
            cache = cache || {};
            cache[key] = value;
        },
        getCache: function (key) {
            var cache = this.cache;
            cache = cache || {};
            return cache[key];
        },
        render: function (data, templateContent) {
            if (data && data.uniqueID && data.uniqueID.length > 0 && templateContent && templateContent.length > 0) {
                var indexStart = templateContent.indexOf("<" + data.uniqueID + ">");
                indexStart += data.uniqueID.length + 2;
                var indexEnd = templateContent.indexOf("</" + data.uniqueID + ">");
                if (indexStart > 0 && indexEnd > 0 && indexStart < indexEnd) {
                    var templHtml = templateContent.substring(indexStart, indexEnd);
                    var templ = _.template(templHtml);
                    this.extend(data.datas);
                    var html = templ(data.datas);
                    data.dom && data.dom.html(html);
                }
            }
            data.callback && data.callback();
        },
        extend: function (datas) {
            if (datas) {
                datas.DateJsonToJS = this.DateJsonToJS;
                datas.DateJsonToJSDate = this.DateJsonToJSDate
                datas.DateJsonToJSTime = this.DateJsonToJSTime;
            }
        },
        DateJsonToJS: function (jsonDate) {
            var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
            return date;
        },
        DateJsonToJSDate: function (jsonDate) {
            var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
            var str = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay();
            return str;
        },
        DateJsonToJSTime: function (jsonDate) {
            var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
            var str = date.getHours() + ":" + date.getMinutes();// +":" + date.getSeconds();
            return str;
        }
    };
    return templateC;
});
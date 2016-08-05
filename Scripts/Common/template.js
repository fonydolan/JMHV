define(['underscore'], function (_) {
    var templateC = {
        cache: {},
        dataTepml: { dom: null, datas: null, url: null, uniqueID: null, callback: null },
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
            templateC.cache = templateC.cache || {};
            templateC.cache[key] = value;
        },
        getCache: function (key) {
            templateC.cache = templateC.cache || {};
            return templateC.cache[key];
        },
        render: function (data, templateContent) {
            if (data && data.uniqueID && data.uniqueID.length > 0 && templateContent && templateContent.length > 0) {
                var indexStart = templateContent.indexOf("<" + data.uniqueID + ">");
                indexStart += data.uniqueID.length + 2;
                var indexEnd = templateContent.indexOf("</" + data.uniqueID + ">");
                if (indexStart > 0 && indexEnd > 0 && indexStart < indexEnd) {
                    var templHtml = templateContent.substring(indexStart, indexEnd);
                    debugger;
                    var templ = _.template(templHtml);
                    var html = templ(data.datas);
                    data.dom && data.dom.html(html);
                }
            }
            data.callback && data.callback();
        }

    };

    return templateC;
});
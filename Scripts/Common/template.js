define(['underscore'], function (_) {
    var template = {
        cache: {},
        dataTepml: { dom: null, data: null, url: null, uniqueID: null, callback: null },
        load: function (data) {
            if (data && data.url && data.url.length > 0) {
                var content = template.load.getCache(data.url);
                if (content) {
                    template.load.render(data, content);
                }
                else {
                    template.load.loadTemplate(data, content);
                }
            }
        } .method("loadTemplate", function (data) {
            var xhr = $.ajaxSettings.xhr();
            xhr.open("GET", data.url, true);
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    template.setCache(data.url, xhr.responseText);
                    template.load.render(data, xhr.responseText);
                }
            }
        }).method("setCache", function (key, value) {
            template.cache = template.cache || {};
            template.cache[key] = value;
        }).method("getCache", function (key) {
            template.cache = template.cache || {};
            return template.cache[key];
        }).method("render", function (data, templateContent) {
            if (data && data.uniqueID && data.uniqueID.length > 0 && templateContent && templateContent.length > 0) {
                var indexStart = templateContent.indexOf("<" + uniqueID + ">");
                indexStart += uniqueID.length + 2;
                var indexEnd = templateContent.indexOf("</" + uniqueID + ">");
                if (indexStart > 0 && indexEnd > 0 && indexStart > indexEnd) {
                    var templ = templateContent.substring(indexStart, indexEnd);
                    data.dom && data.dom.html(_.template(templ, data.data));
                }
            }
            data.callback && data.callback();
        })

    }
    return template;
});
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
                    var templ = _.template(templHtml);
                    this.extend(data.datas);
                    var html = templ(data.datas);
                    data.dom && data.dom.html(html) && this.eventsExtend(data.dom);
                } else {
                    console.info('模板标记（<' + data.uniqueID + '></' + data.uniqueID + '>）不准确！')
                }
            }
            data.callback && data.callback();
        },
        extend: function (datas) {
            if (datas) {
                datas.DateJsonToJS = this.DateJsonToJS;
                datas.DateJsonToJSDate = this.DateJsonToJSDate
                datas.DateJsonToJSTime = this.DateJsonToJSTime;
                datas.DateJsonToJSDateTime = this.DateJsonToJSDateTime;
                datas.DecimalTrim = this.DecimalTrim;
                datas.ArrayToString = this.ArrayToString;
                datas.TrimStart = this.TrimStart;
                datas.TrimEnd = this.TrimEnd;
                datas.ArrayKeyValueJoin = this.ArrayKeyValueJoin;
            }
        },
        eventsExtend: function (dom) {
            var templ = this;
            if (dom) {
                dom.delegate("input[data-tmpltype=decimal]", 'keyup afterpaste', function () {
                    if ($(this).val()) {
                        $(this).val(templ.DecimalTrim($(this).val()));
                    }
                });
                dom.delegate("input[data-tmpltype=number]", 'keyup afterpaste', function () {
                    if ($(this).val()) {
                        $(this).val(templ.NumberTrim($(this).val()));
                    }
                });
            }
        },
        DateJsonToJS: function (jsonDate) {
            var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
            return date;
        },
        DateJsonToJSDateTime: function (jsonDate) {
            var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
            var str = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay();
            str += " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            return str;
        },
        DateJsonToJSDate: function (jsonDate) {
            var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
            var str = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay();
            return str;
        },
        DateJsonToJSTime: function (jsonDate) {
            var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
            var str = date.getHours() + ":" + date.getMinutes(); // +":" + date.getSeconds();
            return str;
        },
		//浮点数 保留小数 限制长度
        DecimalTrim: function (val,len,lenDot) {
            if (val) {
				if(!len || len<=0)
					len = 6;
				if(!lenDot || lenDot<=0)
					lenDot = 2;
                val = val.replace(/[^\d.]/g, "");
                val = val.replace(/^\./g, "")
                val = val.replace(/\.{2,}/g, ".");
                val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                var index = val.indexOf('.');
                var first = "", last = "", point = "";
                if (index && index > 0) {
                    var str = val.split('.');
                    first = str[0];
                    last = str[1];
                    point = ".";
                } else {
                    first = val;
                }
                if (first && first.length > 0) {
                    if (first.length > len)
                        first = first.substr(0,len);
                    val = first + point;
                }
                if (last && last.length > 0) {
                    if (last.length > lenDot)
                        last = last.substr(0, lenDot);
                    val = first + '.' + last;
                } 
            }
            return val;
        },
		//限制长度
        NumberTrim: function (val,len) {
            if (val) {
				if(!len || len<=0)
					len = 6;
                val = val.replace(/[^\d{6}$]/g, "");
                if (val && val.length > len) {
                    val = val.substr(0,len);
                }
            }
            return val;
        },
        ArrayToString: function (array) {
            var val = "";
            if (array && array.length > 0) {
                val = array.join(',');
            }
            return val;
        },
        TrimStart: function (str, key) {
            if (str && str.length > 0) {
                if (key && key.length > 0 && str.length >= key.length) {
                    while (true) {
                        if (str.substr(0, key.length) != key)
                            break;
                        str = str.substr(key.length);
                    }
                }
                return str;
            }
        },
        TrimEnd: function (str, key) {
            if (str && str.length > 0) {
                if (key && key.length > 0 && str.length >= key.length) {
                    while (true) {
                        if (str.substr(str.length - key.length, key.length) != key)
                            break;
                        str = str.substr(0, str.length - key.length);
                    }
                }
                return str;
            }
        },
        ArrayKeyValueJoin: function (array, key, splitFlag) {
            if (!splitFlag)
                splitFlag = ',';
            var val = '';
            if (array && array.length > 0) {
                for (var i = 0; i < array.length; i++) {
                    val += ',' + array[i][key];
                }
                val = this.TrimStart(val, ',')
            }
            return val;
        }
    };
    return templateC;
});
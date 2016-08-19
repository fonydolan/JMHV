/*
模板
CreateDate:2016.8.16
Author:fangqj
EditeDate:2016.8.19 15:37
 */
define(['underscore'], function (_) {
    var templateC = {
        cache: {},
        tmplVersion: '1.0.2',
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
                data.url = data.url + "?v=" + templateC.tmplVersion;
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
                //data-tmpltype='decimal(integerlength,decimallength,maxvalue)'
                dom.delegate("input[data-tmpltype^=decimal]", 'keyup afterpaste', function () {
                    var value = $(this).val();
                    if (value && value.length>0) {
                        var tmpltype = $(this).data('tmpltype');
                        var strEval="";
                        if(tmpltype.length>0)
                        {
                            if(/^decimal\(\d+((\,\d+)\,\d+\.?\d*)?\)$/.test(tmpltype)){
                                strEval = tmpltype.toLocaleLowerCase();
                            }
                        }
                        var valueNew = "";
                        if(strEval && strEval.length>0)
                        {
                            strEval = strEval.replace('decimal(','templ.DecimalTrim('+value+',');
                            valueNew = eval(strEval);
                        }else{
                            valueNew = templ.DecimalTrim(value,6,2,999999.99);
                        }
                        $(this).val(valueNew);
                    }
                });
                //data-tmpltype='number(length,maxvalue)'
                dom.delegate("input[data-tmpltype^=number]", 'keyup afterpaste', function () {
                    var value = $(this).val();
                    if (value && value.length>0) {
                        var tmpltype = $(this).data('tmpltype');
                        var strEval="";
                        if(tmpltype.length>0)
                        {
                            if(/^number\(\d+(\,\d+)?\)$/.test(tmpltype)){
                                strEval = tmpltype.toLocaleLowerCase();
                            }
                        }
                        var valueNew = "";
                        if(strEval && strEval.length>0)
                        {
                            strEval = strEval.replace('number(','templ.IntegerTrim('+value+',');
                            valueNew = eval(strEval);
                        }else{//默认6位
                            valueNew = templ.IntegerTrim(value,6,999999);
                        }
                        $(this).val(valueNew);
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
        //截取数字 长度 小数保留长度 最大值 decimalLen：0-整数；>0-小数位数；else:不限制小数位数
        NumberLengthTrim: function (val,integerLen,decimalLen,maxValue) {
            if(val){
                val = val.toString();
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
                    if(integerLen && integerLen > 0){
                        if (first.length > integerLen)
                            first = first.substr(0, integerLen);
                    }
                    val = first + point;
                }
                if (last && last.length > 0) {
                    if(decimalLen && decimalLen >= 0)
                    {
                        if(decimalLen > 0){
                            if (last.length > decimalLen)
                                last = last.substr(0, decimalLen);
                            if(first.length ==0)
                                first = "0";
                            val = first + '.' + last;
                        }else{
                           val = first; 
                        }
                    }
                }
                if(maxValue)
                {
                    if(Number(val) > Number(maxValue))
                        val = Number(maxValue);
                }
            }
            return val;
        },
        //浮点数 保留小数 限制长度
        DecimalTrim: function (val, len, lenDot,maxValue) {
            if (val) {
                val = val.toString();
                val = val.replace(/[^\d.]/g, "");
                val = val.replace(/^\./g, "")
                val = val.replace(/\.{2,}/g, ".");
                val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                val = templateC.NumberLengthTrim(val,len,lenDot,maxValue);
            }
            return val;
        },
        //限制长度
        IntegerTrim: function (val, len,maxValue) {
            if (val) {
                val = val.toString();
                val = val.replace(/[^\d{6}$]/g, "");
                val = templateC.NumberLengthTrim(val,len,0,maxValue);
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
        TrimStart:function (str,key) {
            if(str&& str.length>0)
            {
                if(key && key.length>0 && str.length >= key.length){
                    while(true){
                        if(str.substr(0,key.length)!=key)
                            break;
                        str = str.substr(key.length);
                    }
                }
                return str;
            }
        },
        TrimEnd:function (str,key) {
            if(str&& str.length>0)
            {
                if(key && key.length>0 && str.length >= key.length){
                    while(true){
                        if(str.substr(str.length-key.length,key.length)!=key)
                            break;
                        str = str.substr(0,str.length-key.length);
                    }
                }
                return str;
            }
        },
        ArrayKeyValueJoin:function(array,key,splitFlag){
            if(!splitFlag)
                splitFlag = ',';
            var val = '';
            if(array&& array.length>0){
                for(var i=0;i<array.length;i++){
                    val += ','+array[i][key];
                }
                val = this.TrimStart(val,',')
            }
            return val;
        }
    };
    return templateC;
});
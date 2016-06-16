$.extend({
    App: {
        bind: function(ev, callback) {
            var _callbacks = this._callbacks || (this._callbacks = {});
            (this._callbacks[ev] || (this._callbacks[ev] = [])).push(callback);
            return this
        },
        trigger: function() {
            var args = Array.prototype.slice.call(arguments, 0);
            var ev = args.shift();
            var that = this;
            var calls, list;
            if (!(calls = this._callbacks))
                return this;
            if (!(list = this._callbacks[ev]))
                return this;
            $.each(list, function(k, v) {
                v.apply(that, args)
            });
            return this
        }
    },
    BENLAI: {
        CSSLink: function(link) {
            return BENLAI.Path.CSSPath + link + '?v=' + BENLAI.Path.Version
        },
        ScriptLink: function(link) {
            return BENLAI.Path.ScriptPath + link + '?v=' + BENLAI.Path.Version
        },
        ImageUrlLink: function(link) {
            return BENLAI.Path.ImagePath + link + '?v=' + BENLAI.Path.Version
        },
        toPrice: function(price, precision) {
            var a = price;
            if (a >= 0) {
                a = parseFloat(a);
                return '¥' + a.toFixed(precision || 2)
            }
            return '¥' + price
        },
        regExp: {
            isNumber: /^(([1-9])(\d+)?)$/,
            hanzi: /[\u4E00-\u9FA5]/g,
            numbers: /^[0-9]+$/,
            email: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
            isNumberOrLetter: /^(?![a-z]+$)(?![A-Z]+$)(?![0-9]+$)[a-zA-Z0-9]+$/,
            tirmAll: /\s/g,
            tirmStart: /^\s*/,
            trimEnd: /\s*$/,
            trim: /(^\s*)|(\s*$)/g,
            zipCode: /^[1-9]{1}\d{5}$/,
            cellPhone: /^1[34578][0-9]{9}$/,
            phone: /^0\d{2,3}-[2-9]\d{6,7}(-\d{0,4})?$/,
            phonereg: /^0?\d{3,4}$/,
            phone1reg: /^\d{7,8}$/,
            phone2reg: /^\d{1,4}$/,
            nickName: /^[0-9A-Za-z_]{4,20}$/,
            time: /^\d{4}-\d{2}-\d{2}$/,
            ReplaceRegExp: function(baseRegExp, replaceRegExp, newRegExp) {
                return baseRegExp.replace(replaceRegExp, newRegExp)
            }
        },
        serialize: function(data) {
            var _output = [];
            if (data) {
                for (var key in data) {
                    _output.push(key + ':' + data[key])
                }
            }
            return _output.join(',')
        },
        requestQueue: [],
        ajaxInstance: null ,
        ajax: function(data) {
            (function(_utils, _data) {
                function AjaxStart() {
                    new AjaxRequest()
                }
                function AjaxRequest() {
                    this.init()
                }
                AjaxRequest.prototype = {
                    requestErrorDefaultMsg: '请求失败，请重试',
                    init: function() {
                        if (!_data.args && _data.data) {
                            _data.args = _data.data
                        }
                        if (!_data.callback && _data.success) {
                            _data.callback = _data.success
                        }
                        if (!_data.args)
                            _data.args = {};
                        if (typeof (_data.args) == 'object') {
                            _data.args['__RequestVerificationToken'] = $(':input[name=__RequestVerificationToken]').val();
                            this.url = _data.url + _utils.serialize(_data.args || {})
                        } else {
                            var __RequestVerificationToken = '&__RequestVerificationToken=' + $(':input[name=__RequestVerificationToken]').val();
                            _data.args += __RequestVerificationToken;
                            this.url = _data.url + _data.args
                        }
                        if (this.validateRequest()) {
                            this.beginRequest()
                        }
                    },
                    validateRequest: function() {
                        for (var urls in _utils.requestQueue) {
                            if (_utils.requestQueue[urls] == this.url) {
                                return false
                            }
                        }
                        _utils.requestQueue.push(this.url);
                        return true
                    },
                    beginRequest: function() {
                        var _this = this;
                        $.ajax({
                            type: _data.type || "post",
                            url: _data.url,
                            data: _data.args || {},
                            async: _data.async === undefined ? true : _data.async,
                            beforeSend: function() {
                                if (_data.beforeSend) {
                                    _data.beforeSend()
                                }
                            },
                            cache: _data.cache || false,
                            success: function(resultData) {
                                var validate = true;
                                if (!_data.notvalidate) {
                                    validate = _this.responseValidate(resultData.msg || resultData)
                                }
                                if (validate) {
                                    if (_data.callback) {
                                        _data.callback(resultData)
                                    }
                                } else {
                                    if (_data.error) {
                                        _data.error()
                                    }
                                }
                                setTimeout(function() {
                                    _this.requestDispose()
                                }, 500)
                            },
                            error: function() {
                                _this.requestDispose();
                                if (_data.error) {
                                    _data.error()
                                } else {
                                    _utils.alert({
                                        msg: _this.requestErrorDefaultMsg,
                                        status: 0
                                    })
                                }
                            }
                        })
                    },
                    responseValidate: function(data) {
                        if (typeof (data) != 'object') {
                            for (var key in this.IllegalRequestResultData) {
                                var _illegalRequestResultData = this.IllegalRequestResultData[key];
                                var _result = _illegalRequestResultData.result;
                                var _msg = _illegalRequestResultData.msg;
                                var _index = _illegalRequestResultData.index;
                                if (_index == 1) {
                                    if (data.indexOf(_result) >= 0) {
                                        _utils.alert({
                                            msg: _msg,
                                            status: 0,
                                            callback: _illegalRequestResultData.callback
                                        });
                                        return false
                                    }
                                } else {
                                    if (data == _result) {
                                        _utils.alert({
                                            msg: _msg,
                                            status: 0,
                                            callback: _illegalRequestResultData.callback
                                        });
                                        return false
                                    }
                                }
                            }
                        }
                        return true
                    },
                    requestDispose: function() {
                        for (var i = 0, j = _utils.requestQueue.length; i < j; i++) {
                            if (_utils.requestQueue[i] == this.url) {
                                _utils.requestQueue.splice(i, 1);
                                return
                            }
                        }
                    },
                    requestErrorDefaultMsg: '请求失败，请重试或刷新页面',
                    IllegalRequestResultData: [{
                        result: '您输入或提交的信息中包含html标记或单引号等，请重新输入',
                        msg: '检测到您提交的信息中包含html标记或单引号等信息，请检查后重新提交',
                        index: -1
                    }, {
                        result: 'request error',
                        msg: '请求失败，请重试',
                        index: -1
                    }, {
                        result: 'splitorder',
                        index: -1,
                        callback: function() {
                            window.location.href = '/Shopping/GCheck'
                        }
                    }, {
                        result: 'soItemNull',
                        msg: '购物车内没有产品信息，请挑选您要购买的产品',
                        index: -1,
                        callback: function() {
                            window.location.href = '/cart.html'
                        }
                    }, {
                        result: 'soInfonull',
                        msg: '加载订单信息失败，请返回购物车重试',
                        index: -1,
                        callback: function() {
                            window.location.href = '/cart.html'
                        }
                    }, {
                        result: 'loginOut',
                        msg: '您未登录，请先登录',
                        index: -1,
                        callback: function() {
                            window.location.href = '/login.html'
                        }
                    }]
                };
                AjaxStart()
            })(this, data)
        },
        alert: function(data) {
            if (data.msg) {
                alert(data.msg, data.status || 0);
                if (data.callback) {
                    $('#closeAlertSp').bind('click', function() {
                        data.callback();
                        $('#closeAlertSp').unbind('click')
                    })
                }
            } else {
                if (data.callback)
                    data.callback()
            }
        },
        format: function(template) {
            return $.BENLAI.replace(template, [].slice.call(arguments, 1))
        },
        enter: function(event) {
            return (window.event && window.event.keyCode || event.which) == 13
        },
        replace: function(template, data) {
            return template.replace(/{([^{]*?)}/g, function(match, key) {
                return data[key] == null ? match : data[key]
            })
        },
        countDown: function(param) {
            var e = {
                g: param.end ? param.end.getTime() : new Date().getTime(),
                e: param.date.getTime(),
                d: 1000 * 60 * 60 * 24,
                h: 1000 * 60 * 60,
                m: 1000 * 60,
                s: 1000,
                ms: 100
            };
            e.n = e.e - e.g;
            var r = {
                day: '0',
                hour: '0',
                minute: '00',
                second: '00',
                millisecond: '0',
                timeend: true
            };
            if (e.n > 0) {
                r.day = Math.floor(e.n / e.d);
                e.n -= r.day * e.d;
                r.hour = Math.floor(e.n / e.h);
                e.n -= r.hour * e.h;
                r.minute = Math.floor(e.n / e.m);
                e.n -= r.minute * e.m;
                r.second = Math.floor(e.n / e.s);
                e.n -= r.second * e.s;
                r.millisecond = Math.floor(e.n / e.ms);
                for (var a in r) {
                    if (a == 'timeend') {
                        continue
                    }
                    if (r[a] > 0) {
                        r.timeend = false
                    }
                    if (r[a] < 10 && a != 'millisecond') {
                        r[a] = '0' + r[a]
                    } else {
                        r[a] = '' + r[a]
                    }
                }
            }
            param.data = r;
            param.dom.html($.BENLAI.replace(param.temp, param.data));
            if (Math.floor((e.e - e.g) / 1000 <= 0) && param.callback) {
                param.callback();
                return
            }
            $.BENLAI.countDown.Timer = setTimeout(function() {
                $.BENLAI.countDown(param)
            }, param.time || 1000)
        },
        tmpl: function(data) {
            if (data.v.indexOf("url:") == 0) {
                var link = $.trim(data.v.substring(4));
                if (link && link.indexOf("/") == 0) {
                    link = link.substring(1)
                }
                data.v = $.BENLAI.ScriptLink("template/" + link);
                var cache = $.BENLAI.tmpl.getCache(data.v);
                if (cache) {
                    data.v = cache;
                    $.BENLAI.tmpl.render(data)
                } else {
                    $.BENLAI.tmpl.loadTmpl(data)
                }
            } else {
                $.BENLAI.tmpl.render(data)
            }
        }
        .method("loadTmpl", function(data) {
            var xhr = $.ajaxSettings.xhr();
            xhr.open("GET", data.v, true);
            xhr.send();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    $.BENLAI.tmpl.setCache(data.v, xhr.responseText);
                    data.v = xhr.responseText;
                    $.BENLAI.tmpl.render(data)
                }
            }
        }).method("getCache", function(key) {
            $.BENLAI.tmpl.cache = $.BENLAI.tmpl.cache || {};
            return $.BENLAI.tmpl.cache[key]
        }).method("setCache", function(key, value) {
            $.BENLAI.tmpl.cache = $.BENLAI.tmpl.cache || {};
            $.BENLAI.tmpl.cache[key] = value
        }).method("render", function(data) {
            var regJs = /<%([\w\W]*?)%>/g
              , regJsExpression = /\bbreak\b|\bcase\b|\bcatch\b|\bcontinue\b|\bdefault\b|\bdelete\b|\bdo\b|\belse\b|\bfinally\b|\bfor\b|\bfunction\b|\bif\b|\breturn\b|\bswitch\b|\bthrow\b|\btry\b|\bvar\b|\bwhile\b|\bwith\b|{|}/g
              , newval = ' var r=[];\n'
              , len = 0;
            var append = function(val, script) {
                return script ? (newval += val.match(regJsExpression) ? val + '\n' : 'r.push(' + val + ');\n') : (newval += val != '' ? 'r.push("' + val.replace(/"/g, '\\"') + '");\n' : ''),
                append
            }
            ;
            while (match = regJs.exec(data.v)) {
                append(data.v.slice(len, match.index))(match[1], true);
                len = match.index + match[0].length
            }
            append(data.v.slice(len));
            newval += ' return r.join("");';
            data.dom.html(new Function(newval.replace(/[\n\r\t]/g, "")).apply(data.datas));
            data.callback && data.callback()
        })
    }
});
$(function() {
    $.ajaxSetup({
        cache: false
    });
    $('body').delegate('textarea', 'keyup', function() {
        var a = $(this).val();
        var v = a.replace(new RegExp(/<|>|&gt|&lt/g), '');
        if (v != a) {
            $(this).val(v)
        }
    });
    $('body').delegate('input[type=text]', 'keyup', function() {
        var a = $(this).val();
        var v = a.replace(new RegExp(/(\$|<|>|&|\*|%|\?)/g), '');
        if (v != a) {
            $(this).val(v)
        }
    }).delegate('[data-type=num],[data-type=decimal]', 'keyup', function() {
        var a = $(this).val();
        var t = $(this).attr('data-type');
        var v;
        if (t === 'num')
            v = a.replace(new RegExp(/[^\d]/g), '');
        else
            v = a.replace(new RegExp(/[^\d|^\d.\d]/g), '');
        if (v != a) {
            $(this).val(v)
        }
        var d = $(this).attr('data-id');
        var m = $(this).attr('maxlength');
        if (v.length > m) {
            return false
        }
    }).delegate('input[type=text]', 'blur', function() {
        var v = $(this).val();
        if (v.indexOf("'") >= 0) {
            v = v.replace(new RegExp(/(')/g), '"')
        }
        $(this).val(v);
        return true
    });
    $('[benlai-type=tab]').each(function() {
        var child = $(this).attr('tab-child')
          , tabtype = $(this).attr('tab-type')
          , tcls = $(this).attr('tab-toggleClass')
          , cls = $(this).attr('tab-showtoggleClass')
          , time = $(this).attr('tab-showtimeOut') || 0;
        if (child && tabtype) {
            (function(t, c, type, tcls, cls, time) {
                var mouseid;
                $(t).delegate(c, type, function(e) {
                    var callback = $(this).attr('benlai-showcallback')
                      , id = $(this).attr('benlai-showid');
                    if (mouseid == id) {
                        return false
                    }
                    mouseid = id;
                    var that = this;
                    setTimeout(function() {
                        if (mouseid) {
                            if (tcls)
                                $(that).addClass(tcls).siblings().removeClass(tcls);
                            if (cls)
                                $(id).addClass(cls).show().siblings().removeClass(cls).hide();
                            else
                                $(id).show.siblings().hide();
                            if (callback)
                                $.App.trigger(callback, e, that)
                        }
                    }, time)
                });
                if (type === 'mouseover' || type === 'mouseenter') {
                    $(t).delegate(c, 'mouseleave', function() {
                        mouseid = ''
                    })
                }
            })(this, child, tabtype, tcls, cls, time)
        }
    })
});
(function($) {
    var Controllers = {};
    var temp = '$'
      , baseAttrKey = 'benlai-id';
    Controllers.create = function(includes) {
        var mvc = function() {
            this.initializer.apply(this, arguments);
            this.inits.apply(this, arguments)
        }
        ;
        mvc.proxy = function(func) {
            return $.proxy(func, this)
        }
        ;
        mvc.fn = mvc.prototype;
        mvc.fn.inits = function() {}
        ;
        mvc.fn.proxy = mvc.proxy;
        mvc.include = function(ob) {
            $.extend(this.fn, ob)
        }
        ;
        mvc.extend = function(ob) {
            $.extend(this, ob)
        }
        ;
        mvc.updateView = function(func, callback) {
            if (func) {
                func();
                var that = this;
                setTimeout(function() {
                    that.refreshElements();
                    that.refreshEles();
                    if (callback) {
                        callback.apply(that, arguments)
                    }
                }, 100)
            }
        }
        ;
        mvc.fn.updateView = mvc.updateView;
        mvc.include($.BENLAI);
        mvc.include({
            initializer: function(options) {
                this.options = options;
                for (var o in this.options) {
                    this[o] = this.options[o]
                }
                this.refreshEles();
                if (this.elements)
                    this.refreshElements();
                if (this.events)
                    this.delegateEvents();
                if (this.appEvents)
                    this.bindAppEvents();
                if (this.mouseHandler)
                    this.bindMouseEvents();
                if (!this.back) {
                    if (this.init)
                        this.init()
                }
            },
            $: function(key) {
                if (key) {
                    return $(key, this.el)
                }
                return null
            },
            refreshEles: function() {
                var that = this;
                this.el.find('[' + baseAttrKey + ']').each(function() {
                    var targetid = $(this).attr(baseAttrKey);
                    that[targetid] = $(this);
                    that[temp + targetid] = '[' + baseAttrKey + ']'
                })
            },
            refreshElements: function() {
                var eles = this.elements;
                for (var key in eles) {
                    var val = eles[key];
                    if (!val) {
                        continue
                    }
                    if (typeof (val) != 'object') {
                        this[val] = this.$(key);
                        this[temp + val] = key
                    } else {
                        for (var a in val) {
                            this[val[a]] = this.$(a);
                            this[temp + val[a]] = a
                        }
                    }
                }
            },
            delegateEvents: function() {
                for (var key in this.events) {
                    (function(obj) {
                        try {
                            var methodName = obj.events[key];
                            var method = obj.proxy(obj[methodName]);
                            var match = key.split(/\s+/g);
                            if (match.length > 2) {
                                match.unshift(match.shift() + ' ' + match.shift())
                            }
                            match.push(function(e) {
                                (function(k, event) {
                                    method.call(obj, k, (event || window.event))
                                })(this, e)
                            });
                            obj.el.delegate.apply(obj.el, match)
                        } catch (e) {
                            console.log(e.message)
                        }
                    })(this)
                }
            },
            bindAppEvents: function() {
                for (var key in this.appEvents) {
                    var method = this.appEvents[key];
                    var proxy = this.proxy(this[method]);
                    $.App.bind(key, proxy)
                }
            }
        });
        if (includes)
            mvc.include(includes);
        return mvc
    }
    ;
    $.fn.extend({
        CreateController: function(options) {
            var controller = Controllers.create(options);
            return new controller({
                el: this
            })
        }
    })
})(jQuery);
